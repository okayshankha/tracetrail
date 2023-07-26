import './App.css'
import TrailTraceLogo from './assets/images/trailtrace-logo.png'
import Main from './pages/Main'

function App() {
  return (
    <>
      <div className="container">
        <div className="content-wrapper">
          <div className="logo">
            <img src={TrailTraceLogo} alt="TraceTrail Logo" />
          </div>
          <Main></Main>
        </div>
      </div>
    </>
  )
}

export default App
