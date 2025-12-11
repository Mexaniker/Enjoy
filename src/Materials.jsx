const Materials = () => {
  const files = [
    { title: 'Учебник Enjoy English (B1)', type: 'PDF', size: '12 MB' },
    { title: 'Список слов: Путешествия', type: 'DOCX', size: '2 MB' },
    { title: 'Таблица времен английского', type: 'JPG', size: '500 KB' },
  ];

  return (
    <div>
      <h1>Учебные материалы 📚</h1>
      <p className="subtitle">Все необходимое для учебы в одном месте</p>

      <div className="card">
        {files.map((file, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '15px 0',
            borderBottom: index !== files.length - 1 ? '1px solid #EEF2F6' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '40px', height: '40px', 
                background: '#EEF2F6', borderRadius: '8px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#06266F', fontWeight: '700', fontSize: '0.8rem'
              }}>
                {file.type}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#06266F' }}>{file.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#5A6B89' }}>{file.size}</div>
              </div>
            </div>
            
            <button style={{ 
              background: 'transparent', border: 'none', 
              color: '#FF7403', fontWeight: '600', cursor: 'pointer' 
            }}>
              Скачать ⬇️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
