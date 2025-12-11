import { useState } from 'react';

const Home = () => {
  return (
    <div>
      {/* Приветственная секция */}
      <div style={{ marginBottom: '20px' }}>
        <h1>Good Morning, Student! ☀️</h1>
        <p className="subtitle" style={{ marginBottom: '20px' }}>Готовы улучшить свой английский сегодня?</p>
      </div>

      {/* Карточка с видео */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#06266F', textAlign: 'center' }}>
          📺 Видео-урок дня: Учим английский по сериалам
        </h3>
        
        {/* Ограничитель ширины для видео (центруем его) */}
        <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <div className="video-responsive">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/juKd26qkNAw?si=ScL-wGgT8y7qbbFh" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div style={{ 
          marginTop: '15px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '700px', /* Выравниваем подвал по ширине видео */
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <span style={{ color: '#5A6B89', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ⏱ 28 мин
          </span>
          <button className="action-btn" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
            Я посмотрел
          </button>
        </div>
      </div>

      {/* Стили */}
      <style>{`
        .video-responsive {
          overflow: hidden;
          padding-bottom: 56.25%; /* Соотношение 16:9 */
          position: relative;
          height: 0;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #000; /* Черный фон пока грузится */
        }

        .video-responsive iframe {
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          position: absolute;
        }
      `}</style>
    </div>
  );
};

export default Home;
