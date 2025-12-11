import { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const MyStudents = () => {
  const [students, setStudents] = useState([]); // Список закрепленных учеников
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // --- ЗАГРУЗКА СПИСКА УЧЕНИКОВ ---
  const fetchStudents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Запрос: идем в teacher_students и "джойним" таблицу profiles через student_id
    const { data, error } = await supabase
      .from('teacher_students')
      .select(`
        id,
        student:student_id (
          id,
          full_name,
          email,
          avatar_url,
          role
        )
      `)
      .eq('teacher_id', user.id);

    if (error) {
      console.error('Ошибка загрузки:', error);
    } else {
      // Преобразуем данные в удобный вид
      // data выглядит как [{ id: 1, student: { full_name: '...' } }, ...]
      setStudents(data || []);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- ДОБАВЛЕНИЕ УЧЕНИКА ---
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user: teacher } } = await supabase.auth.getUser();

      // 1. Ищем ID ученика по Email в таблице profiles
      const { data: studentProfile, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newStudentEmail)
        .single();

      if (searchError || !studentProfile) {
        alert('Пользователь с таким Email не найден в системе.');
        setLoading(false);
        return;
      }

      // 2. Создаем связь в teacher_students
      const { error: linkError } = await supabase
        .from('teacher_students')
        .insert([{ teacher_id: teacher.id, student_id: studentProfile.id }]);

      if (linkError) {
        if (linkError.code === '23505') alert('Этот ученик уже добавлен в ваш список.');
        else alert('Ошибка добавления: ' + linkError.message);
      } else {
        alert('Ученик успешно прикреплен!');
        setNewStudentEmail('');
        fetchStudents(); // Обновляем список на экране
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- УДАЛЕНИЕ УЧЕНИКА ---
  const handleRemoveStudent = async (recordId) => {
    if (!window.confirm('Открепить этого ученика от вас?')) return;

    // Удаляем запись из таблицы связей по её ID
    const { error } = await supabase
      .from('teacher_students')
      .delete()
      .eq('id', recordId);

    if (error) alert('Ошибка удаления');
    else fetchStudents();
  };

  return (
    <div>
      <h1>Мои ученики 🎓</h1>
      <p className="subtitle">Управление классом</p>

      {/* --- ФОРМА ДОБАВЛЕНИЯ --- */}
      <div className="card" style={{ marginBottom: '30px', background: '#FFF4EB', border: '2px dashed #FF7403' }}>
        <h3>➕ Добавить нового ученика</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
          Введите email, с которым ученик зарегистрировался в приложении.
        </p>
        <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="email" 
            placeholder="student@example.com" 
            className="styled-input"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" className="action-btn" disabled={loading}>
            {loading ? 'Поиск...' : 'Прикрепить'}
          </button>
        </form>
      </div>

      {/* --- СПИСОК КАРТОЧЕК --- */}
      <h3 style={{ color: '#06266F', marginBottom: '20px' }}>Список класса ({students.length})</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {students.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#aaa', border: '1px dashed #ccc', borderRadius: '20px' }}>
            У вас пока нет прикрепленных учеников.
          </div>
        ) : (
          students.map((item) => {
            const student = item.student; // Данные внутри объекта student
            return (
              <div key={item.id} className="card" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '15px' }}>
                
                {/* Аватарка */}
                <div style={{ 
                  width: '60px', height: '60px', borderRadius: '50%', background: '#EEF2F6', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  {student.avatar_url ? <img src={student.avatar_url} style={{width: '100%', borderRadius: '50%'}}/> : '👤'}
                </div>

                {/* Инфо */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ margin: '0 0 5px', color: '#06266F', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {student.full_name || 'Без имени'}
                  </h3>
                  <p style={{ color: '#5A6B89', fontSize: '0.85rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {student.email}
                  </p>
                </div>

                {/* Кнопка удаления */}
                <button 
                  onClick={() => handleRemoveStudent(item.id)}
                  title="Открепить ученика"
                  style={{ 
                    background: '#FFE5E5', color: '#FF4D4F', border: 'none', 
                    borderRadius: '8px', width: '32px', height: '32px', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  ✕
                </button>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyStudents;