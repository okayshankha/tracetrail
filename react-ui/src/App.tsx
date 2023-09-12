import { ReactNotifications } from 'react-notifications-component'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import TrailTraceLogo from './assets/images/trailtrace-logo.png'
import LoginPage from './pages/Login'
import Main from './pages/Main'

console.log(localStorage.getItem('token'))

function App() {
  return (
    <>
      <ReactNotifications />
      <div className="container">
        <div className="content-wrapper">
          <div className="logo">
            <img src={TrailTraceLogo} alt="TraceTrail Logo" />
          </div>

          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route index element={<Main />} />
                <Route path="sign-in" element={<LoginPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </>
  )
}

export default App
