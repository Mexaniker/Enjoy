const Profile = () => {
  return (
    <div className="page-content">
      <h1>Личный кабинет</h1>
      <p className="subtitle">Управление аккаунтом dev</p>
      
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👨‍💻</div>
          <div>
            <h3>Разработчик</h3>
            <p style={{ color: '#888' }}>dev@example.com</p>
          </div>
        </div>
        <div className="form-group">
          <label>Имя пользователя</label>
          <input type="text" value="dev" readOnly className="styled-input" />
        </div>
      </div>
    </div>
  );
};
export default Profile;