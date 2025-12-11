import { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const Schedule = ({ role }) => {
  const [lessons, setLessons] = useState([]);
  const [myStudents, setMyStudents] = useState([]); // Список для выпадающего меню
  const [loading, setLoading] = useState(true);
  
  const [newLesson, setNewLesson] = useState({
    topic: '',
    start_time: '',
    student_id: '', // ID ученика теперь обязателен
    link: ''
  });

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. Загрузка уроков (с учетом RLS Supabase вернет только разрешенные)
  const fetchSchedule = async () => {
    setLoading(true);
    
    // ВАЖНО: Мы явно указываем !fk_student и !fk_teacher
    // Это говорит Supabase использовать именно эти связи
    const { data, error } = await supabase
      .from('schedule')
      .select(`
        *,
        student:profiles!fk_student(full_name, email),
        teacher:profiles!fk_teacher(full_name)
      `)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('ОШИБКА ЗАГРУЗКИ:', error); // Смотри в консоль браузера (F12)
      alert('Не удалось загрузить уроки. Подробности в консоли.');
    } else {
      console.log('Загруженные уроки:', data); // Проверь, пришли ли данные
      setLessons(data || []);
    }
    setLoading(false);
  };

  // 2. Загрузка списка учеников (только для учителя, чтобы заполнить select)
  const fetchMyStudents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('teacher_students')
      .select('student_id, profiles:student_id (id, full_name, email)')
      .eq('teacher_id', user.id);

    if (data) setMyStudents(data.map(item => item.profiles));
  };

  useEffect(() => {
    fetchSchedule();
    if (role === 'teacher' || role === 'admin') {
      fetchMyStudents();
    }
  }, [role]);

  // Добавление урока
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!newLesson.student_id) return alert('Выберите ученика!');

    const { data: { user } } = await supabase.auth.getUser();

    const lessonData = {
      topic: newLesson.topic,
      start_time: newLesson.start_time,
      link: newLesson.link,
      teacher_id: user.id, // Я - учитель
      student_id: newLesson.student_id // Выбранный ученик
    };

    const { error } = await supabase.from('schedule').insert([lessonData]);

    if (error) alert('Ошибка: ' + error.message);
    else {
      setNewLesson({ topic: '', start_time: '', student_id: '', link: '' });
      fetchSchedule();
    }
  };

  // Удаление
  const handleDelete = async (id) => {
    if(!window.confirm('Удалить урок?')) return;
    const { error } = await supabase.from('schedule').delete().eq('id', id);
    if (!error) fetchSchedule();
  };

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDay = (date) => new Date(date).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h1>{role === 'student' ? 'Мои занятия 📅' : 'Расписание преподавания 🎓'}</h1>
           <p className="subtitle">Персональное расписание</p>
        </div>
      </div>

      {/* --- ФОРМА ДЛЯ УЧИТЕЛЯ --- */}
      {(role === 'teacher' || role === 'admin') && (
        <div className="card" style={{ marginBottom: '30px', border: '2px dashed #FF7403', background: '#FFF4EB' }}>
          <h3>➕ Назначить урок</h3>
          <form onSubmit={handleAddLesson} style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            
            {/* Выбор ученика */}
            <select 
              className="styled-input" 
              value={newLesson.student_id}
              onChange={e => setNewLesson({...newLesson, student_id: e.target.value})}
              required
            >
              <option value="">-- Выберите ученика --</option>
              {myStudents.map(s => (
                <option key={s.id} value={s.id}>{s.full_name || s.email}</option>
              ))}
            </select>

            <input 
              type="text" placeholder="Тема урока" className="styled-input"
              value={newLesson.topic} onChange={e => setNewLesson({...newLesson, topic: e.target.value})}
              required
            />
            <input 
              type="datetime-local" className="styled-input"
              value={newLesson.start_time} onChange={e => setNewLesson({...newLesson, start_time: e.target.value})}
              required
            />
            <input 
              type="text" placeholder="Ссылка (Zoom/Meet)" className="styled-input"
              value={newLesson.link} onChange={e => setNewLesson({...newLesson, link: e.target.value})}
            />
            <button type="submit" className="action-btn" style={{ gridColumn: '1 / -1' }}>Запланировать</button>
          </form>
        </div>
      )}

      {/* --- СПИСОК УРОКОВ --- */}
      {loading ? <p>Загрузка...</p> : lessons.length === 0 ? <p>Уроков нет.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {lessons.map((lesson) => (
            <div key={lesson.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ 
                    background: '#EEF2F6', borderRadius: '12px', textAlign: 'center', width: '150px', minWidth: '150px', height: '70px', 
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexShrink: 0 
                }}>
                  <div style={{ fontWeight: '800', color: '#06266F', fontSize: '1.2rem', lineHeight: '1' }}>{formatTime(lesson.start_time)}</div>
                  <div style={{ fontSize: '0.75rem', color: '#5A6B89', textTransform: 'capitalize', marginTop: '5px' }}>{formatDay(lesson.start_time)}</div>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#06266F' }}>{lesson.topic}</h3>
                  {/* Учитель видит с КЕМ урок, Ученик видит КТО ведет */}
                  <div style={{ fontSize: '0.9rem', color: '#5A6B89' }}>
                    {role === 'student' 
                      ? `Преподаватель: ${lesson.teacher?.full_name || 'Загрузка...'}`
                      : `Ученик: ${lesson.student?.full_name || 'Неизвестный'}`
                    }
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {lesson.link ? (
                  <a href={lesson.link} target="_blank" rel="noreferrer" className="action-btn" style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '10px 20px' }}>Войти</a>
                ) : <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Нет ссылки</span>}

                {(role === 'teacher' || role === 'admin') && (
                  <button onClick={() => handleDelete(lesson.id)} style={{ background: '#FFE5E5', color: '#FF4D4F', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}>🗑</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`.styled-input { padding: 12px; border: 1px solid #ddd; border-radius: 10px; }`}</style>
    </div>
  );
};

export default Schedule;