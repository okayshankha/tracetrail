import { ReactNotifications } from 'react-notifications-component'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import TrailTraceLogo from './assets/images/trailtrace-logo.png'
import LoginPage from './pages/Login'
import Main from './pages/Main'

function App() {
  return (
    <>
      <ReactNotifications />
      <div className="container">
        <div className="content-wrapper">
          <div className="logo">
            <img src={TrailTraceLogo} alt="TraceTrail Logo" />
          </div>

          <HashRouter>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/sign-in" element={<LoginPage />} />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </>
  )
}

export default App
