const Assignments = () => {
  return (
    <div>
      <h1>Домашние задания 📝</h1>
      <p className="subtitle">Выполните задания, чтобы закрепить материал</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Карточка 1 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ background: '#FFF4EB', color: '#FF7403', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' }}>Грамматика</span>
            <span style={{ color: '#FF4D4F', fontWeight: '600', fontSize: '0.9rem' }}>До завтра</span>
          </div>
          <h3 style={{ margin: '0 0 10px 0', color: '#06266F' }}>Irregular Verbs Test</h3>
          <p style={{ color: '#5A6B89', fontSize: '0.9rem', marginBottom: '20px' }}>
            Продите тест из 20 вопросов на знание неправильных глаголов.
          </p>
          <button className="action-btn" style={{ width: '100%' }}>Начать тест</button>
        </div>

        {/* Карточка 2 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ background: '#E6F7FF', color: '#1890FF', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' }}>Письмо</span>
          </div>
          <h3 style={{ margin: '0 0 10px 0', color: '#06266F' }}>My Last Vacation</h3>
          <p style={{ color: '#5A6B89', fontSize: '0.9rem', marginBottom: '20px' }}>
            Напишите эссе (150 слов) о вашем последнем путешествии.
          </p>
          <button style={{ 
            width: '100%', 
            padding: '14px', 
            borderRadius: '50px', 
            border: '2px solid #EEF2F6', 
            background: 'transparent', 
            color: '#5A6B89', 
            fontWeight: '700', 
            cursor: 'pointer' 
          }}>Загрузить файл</button>
        </div>

      </div>
    </div>
  );
};

export default Assignments;