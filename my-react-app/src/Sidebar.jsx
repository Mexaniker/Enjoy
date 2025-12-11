import React, { useState } from 'react';


const Sidebar = ({ activeTab, onTabChange, onLogout, role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ОБНОВЛЕННЫЙ СПИСОК МЕНЮ
  const menuItems = [
    { id: 'home', label: 'Главная', icon: '🏠' },
    { id: 'schedule', label: 'Расписание', icon: '📅' },    // Новое

    ...((role === 'teacher' || role === 'admin') ? [{ id: 'students', label: 'Мои ученики', icon: '🎓' }] : []),
    { id: 'assignments', label: 'Задания', icon: '📝' },
    { id: 'materials', label: 'Материалы', icon: '📚' },
    { id: 'profile', label: 'Кабинет', icon: '👤' },

  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <style>{`
        .sidebar {
          width: 280px;
          background: #FFFFFF;
          height: 100vh;
          padding: 2rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #95959549;
          position: sticky;
          top: 0;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Плавная анимация */
          position: relative; /* Для позиционирования кнопки */
        }

        /* Состояние свернутого сайдбара */
        .sidebar.collapsed {
          width: 90px;
          padding: 2rem 1rem;
        }

        .toggle-btn {
          position: absolute;
          top: 38px;
          right: -15px;
          width: 30px;
          height: 30px;
          background: #FFFFFF;
          border: 1px solid #EEF2F6;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #06266F;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transition: all 0.3s;
          z-index: 10;
        }

        .toggle-btn:hover {
          background: #FF7403;
          color: white;
          border-color: #FF7403;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 900;
          color: #06266F;
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          height: 40px;
        }
        
        .logo span {
          color: #FF7403;
        }

        /* Центрирование лого при сворачивании */
        .sidebar.collapsed .logo {
          justify-content: center;
          font-size: 2rem;
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          width: 100%;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          border-radius: 16px;
          cursor: pointer;
          font-weight: 600;
          color: #5A6B89;
          border: none;
          background: transparent;
          text-align: left;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          overflow: hidden;
          white-space: nowrap;
        }

        .nav-item:hover {
          background: #FFF4EB;
          color: #FF7403;
        }

        .nav-item.active {
          background: #06266F;
          color: white;
          box-shadow: 0 8px 20px rgba(6, 38, 111, 0.2);
        }

        /* Центрирование иконок при сворачивании */
        .sidebar.collapsed .nav-item {
          padding: 14px;
          justify-content: center;
        }

        .nav-icon {
          margin-right: 12px;
          font-size: 1.3rem;
          min-width: 24px; /* Фиксируем ширину иконки, чтобы она не скакала */
          text-align: center;
        }

        .sidebar.collapsed .nav-icon {
          margin-right: 0;
        }

        /* Скрываем текст плавно */
        .nav-label {
          opacity: 1;
          transition: opacity 0.2s;
        }

        .sidebar.collapsed .nav-label {
          display: none;
        }

        .logout-btn {
          margin-top: auto;
          padding: 12px;
          border: 2px solid #FFE5E5;
          background: transparent;
          color: #FF4D4F;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.3s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          overflow: hidden;
        }

        .sidebar.collapsed .logout-btn {
          padding: 12px 0;
          border-color: transparent;
        }
        
        .sidebar.collapsed .logout-btn:hover {
           background: #FFF0F0;
        }

        .logout-btn:hover {
          background: #FF4D4F;
          color: white;
          border-color: #FF4D4F;
        }
      `}</style>

      {/* Кнопка переключения */}
      <button 
        className="toggle-btn" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Развернуть" : "Свернуть"}
      >
        {isCollapsed ? '➜' : '⬅'}
      </button>

      {/* Логотип меняется в зависимости от состояния */}
      <div className="logo">
        {isCollapsed ? (
          <span>E.</span>
        ) : (
          <>Enjoy<span>.</span></>
        )}
      </div>

      <nav className="nav-list">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            title={isCollapsed ? item.label : ''} // Подсказка при наведении в свернутом виде
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="logout-btn" onClick={onLogout} title="Выйти">
        <span style={{ fontSize: '1.2rem' }}>🚪</span> 
        {!isCollapsed && <span className="nav-label">Выйти</span>}
      </button>
    </aside>
  );
};

export default Sidebar;