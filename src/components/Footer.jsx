import { Link } from 'react-router-dom'
import { examList } from '../data/examData.js'

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
            <p>Бесплатная платформа для подготовки к экзаменам EP в Австрии. Образование должно быть доступным для каждого.</p>
          </div>

          <div>
            <h4>Платформа</h4>
            <ul>
              {examList.map((exam) => (
                <li key={exam.key}><Link to={`/${exam.key}`}>{exam.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>О проекте</h4>
            <ul>
              <li><Link to="/about">О нас</Link></li>
              <li><a href="#">Как это работает</a></li>
              <li><a href="#">Часто задаваемые вопросы</a></li>
            </ul>
          </div>

          <div>
            <h4>Важно</h4>
            <ul>
              <li><a href="#">Пользовательское соглашение</a></li>
              <li><a href="#">Политика конфиденциальности</a></li>
            </ul>
          </div>

          <div>
            <h4>Мы в социальных сетях</h4>
            <div className="social-row">
              <a href="#">✈</a>
              <a href="#">◎</a>
              <a href="#">✉</a>
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
