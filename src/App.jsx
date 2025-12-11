import { useState, useEffect } from 'react'
import LoginPage from './LoginPage'
import Sidebar from './Sidebar'
import Home from './Home'
import Profile from './Profile'
// Импортируем новые компоненты
import Schedule from './Schedule'
import Assignments from './Assignments'
import Materials from './Materials'
import MyStudents from './MyStudents' 

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState('student') // По умолчанию ученик
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    // Эта функция запускается один раз при загрузке сайта
    const initAuth = async () => {
      // 1. Сначала проверяем, есть ли сохраненный токен (для быстрого отображения)
      const token = localStorage.getItem('authToken')
      if (token) {
        setIsAuthenticated(true)
      }

      // --- НОВОЕ: ПРОВЕРКА РОЛИ ЧЕРЕЗ БАЗУ ДАННЫХ SUPABASE ---
      // Если у нас подключен Supabase (через CDN window.supabase)
      if (window.supabase) {
        try {
          const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
          
          // Получаем текущего залогиненного пользователя
          const { data: { user } } = await client.auth.getUser();

          if (user) {
            // Если пользователь есть, идем в таблицу PROFILES узнавать его роль
            const { data: profile, error } = await client
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();

            if (profile && !error) {
              console.log('Роль пользователя загружена из БД:', profile.role);
              setUserRole(profile.role); // 'admin', 'student' или 'teacher'
            }
          } else {
             // Если мы используем старый "фейковый" вход через localStorage, 
             // оставляем роль, которую сохранили при входе (резервный вариант)
             const savedRole = localStorage.getItem('userRole');
             if (savedRole) setUserRole(savedRole);
          }
        } catch (error) {
          console.error("Ошибка проверки роли:", error);
        }
      }
    }

    initAuth();
  }, [])

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const handleLogout = async () => {
    // --- НОВОЕ: Разлогиниваемся и в Supabase тоже ---
    if (window.supabase) {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      await client.auth.signOut();
    }
    
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    setIsAuthenticated(false)
    setUserRole('student')
    setActiveTab('home')
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLoginSuccess} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home />
      // Передаем роль в расписание, чтобы админ видел кнопки редактирования
      case 'schedule': return <Schedule role={userRole} /> 
      case 'assignments': return <Assignments />
      case 'materials': return <Materials />
      case 'profile': return <Profile />
      case 'students': return <MyStudents />;
      default: return <Home />
    }
  }


  return (
    <div className="app-layout">
      {/* Глобальные стили (без изменений) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        :root { --primary-orange: #FF7403; --primary-blue: #06266F; --bg-color: #F9FAFC; --text-main: #06266F; --text-secondary: #5A6B89; --white: #FFFFFF; }
        body { margin: 0; padding: 0; background-color: var(--bg-color); font-family: 'Montserrat', sans-serif; color: var(--text-main); }
        .app-layout { display: flex; min-height: 100vh; }
        .main-content { flex: 1; padding: 40px; overflow-y: auto; }
        h1 { font-size: 2.2rem; font-weight: 800; color: var(--primary-blue); margin: 0 0 10px 0; letter-spacing: -0.5px; }
        .subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 40px; font-weight: 500; }
        .card { background: var(--white); border-radius: 20px; padding: 30px; box-shadow: 0 10px 40px rgba(6, 38, 111, 0.05); border: 1px solid rgba(0,0,0,0.02); transition: transform 0.2s ease; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 15px 50px rgba(6, 38, 111, 0.08); }
        .action-btn { background-color: var(--primary-orange); color: white; border: none; padding: 14px 32px; border-radius: 50px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 116, 3, 0.3); }
        .action-btn:hover { background-color: #e56802; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 116, 3, 0.4); }
        input { font-family: 'Montserrat', sans-serif; }
      `}</style>

      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout} 
        role={userRole}
      />

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
