import { useState } from 'react';

// Используем переменные окружения Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Переключатель между Входом и Регистрацией
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Инициализируем Supabase (через CDN window.supabase, как в App.jsx)
      const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      if (isRegistering) {
        // --- РЕГИСТРАЦИЯ ---
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          // Можно передать дополнительные данные, например имя
          options: {
            data: { full_name: email.split('@')[0] } 
          }
        });

        if (error) throw error;
        
        // После регистрации обычно нужно подтвердить почту, если это включено в Supabase
        alert('Регистрация успешна! Теперь войдите в аккаунт.');
        setIsRegistering(false); // Переключаем на вкладку входа

      } else {
        // --- ВХОД ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;

        // Если вход успешен, получаем роль пользователя из таблицы PROFILES
        const userId = data.user.id;
        
        // Запрашиваем роль
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        // Сохраняем токен (для совместимости с App.jsx)
        localStorage.setItem('authToken', data.session.access_token);
        
        // Вызываем колбэк в App.jsx с полученной ролью
        const role = profile ? profile.role : 'student';
        onLogin(role);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Произошла ошибка. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

        .login-container {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #F0F4F8;
          background-image: radial-gradient(#FF7403 0.5px, transparent 0.5px), radial-gradient(#FF7403 0.5px, #F0F4F8 0.5px);
          background-size: 20px 20px;
          font-family: 'Montserrat', sans-serif;
        }

        .login-card {
          background: #FFFFFF;
          padding: 3rem;
          border-radius: 30px;
          box-shadow: 0 20px 60px rgba(6, 38, 111, 0.1);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }

        h2 { color: #06266F; font-weight: 800; font-size: 2rem; margin-bottom: 0.5rem; }
        p { color: #5A6B89; margin-bottom: 2rem; }

        .input-group { margin-bottom: 1.5rem; text-align: left; }
        .input-group label { display: block; margin-bottom: 0.5rem; color: #06266F; font-weight: 600; font-size: 0.9rem; }
        .input-group input { width: 100%; padding: 14px 16px; border: 2px solid #EEF2F6; border-radius: 12px; font-size: 1rem; outline: none; transition: all 0.3s; box-sizing: border-box; color: #06266F; font-family: 'Montserrat', sans-serif; }
        .input-group input:focus { border-color: #FF7403; }

        .login-btn {
          width: 100%; padding: 16px; background-color: #FF7403; color: white; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s; box-shadow: 0 10px 20px rgba(255, 116, 3, 0.2);
        }
        .login-btn:hover { background-color: #E56802; transform: translateY(-2px); }
        .login-btn:disabled { background-color: #ccc; cursor: not-allowed; box-shadow: none; }

        .error { background: #FFF0F0; color: #D63031; padding: 10px; border-radius: 10px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 600; }
        
        .toggle-link {
          margin-top: 20px;
          color: #5A6B89;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .toggle-link span { color: #FF7403; font-weight: 700; text-decoration: underline; }
      `}</style>

      <div className="login-card">
        <h2>{isRegistering ? 'Регистрация' : 'Вход в Enjoy'}</h2>
        <p>{isRegistering ? 'Создайте новый аккаунт' : 'Рады видеть вас снова!'}</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Пароль</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Загрузка...' : (isRegistering ? 'Создать аккаунт' : 'Войти')}
          </button>
        </form>

        <div className="toggle-link" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
          <span>{isRegistering ? 'Войти' : 'Зарегистрироваться'}</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;