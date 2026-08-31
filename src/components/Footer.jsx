import { Link } from 'react-router-dom'
import { examList } from '../data/examData.js'
import { universities } from '../data/universities.js'
import { IconTelegram } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="main-wrapper">
        <div className="footer-grid">
          <div className="footer-about">
            <div className="logo">
              <div className="logo-mark" style={{ width: 36, height: 36 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 5.5C4 4.67 4.67 4 5.5 4H11V20H5.5C4.67 20 4 19.33 4 18.5V5.5Z" fill="white" fillOpacity=".95" />
                  <path d="M20 5.5C20 4.67 19.33 4 18.5 4H13V20H18.5C19.33 20 20 19.33 20 18.5V5.5Z" fill="white" fillOpacity=".65" />
                </svg>
              </div>
              <b style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 16 }}>EP WONNA</b>
            </div>
            <p>Бесплатная платформа для подготовки к австрийским EPх экзаменам.</p>
          </div>

          <div>
            <h4>EP — экзамены</h4>
            <ul>
              {examList.map((exam) => (
                <li key={exam.key}><Link to={`/${exam.key}`}>{exam.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Моё обучение</h4>
            <ul>
              <li><Link to="/my-learning">Мой прогресс</Link></li>
              <li><Link to="/my-learning/essays">Мои сочинения</Link></li>
              <li><Link to="/dictionary">Словарь</Link></li>
            </ul>
          </div>

          <div>
            <h4>Вступительные в вузы</h4>
            <ul>
              {universities.map((uni) => (
                <li key={uni.key}><Link to={`/uni/${uni.key}`}>{uni.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Важно</h4>
            <ul>
              <li><Link to="/about">О проекте</Link></li>
              <li><a href="#">Пользовательское соглашение</a></li>
              <li><a href="#">Политика конфиденциальности</a></li>
            </ul>
          </div>

          <div>
            <h4>Мы в социальных сетях</h4>
            <div className="social-row">
              <a href="https://t.me/epwonna" target="_blank" rel="noreferrer" aria-label="Telegram">
                <IconTelegram size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 EP WONNA. Все права защищены.</span>
        </div>
      </div>
    </footer>
  )
}
