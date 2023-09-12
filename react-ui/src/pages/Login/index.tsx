import { useCallback, useEffect, useState } from 'react'
import Api from '../../helpers/api'
import { useAppSelector } from '../../app/hooks'
import { useNavigate } from 'react-router-dom'
import { Selector as RequestLogsSelector } from '../../store/request-logs.store'
import { Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

export default function LoginPage() {
  const navigate = useNavigate()

  const [isLoginButtonInActiveState, SetIsLoginButtonInActiveState] =
    useState<boolean>(true)
  const [loginPassword, SetLoginPassword] = useState<
    string | number | readonly string[] | undefined
  >(undefined)
  const requestLogs = useAppSelector(RequestLogsSelector)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/')
    }
  }, [])

  const onLoginSubmit = useCallback(async () => {
    console.log(requestLogs.baseURL + requestLogs.loginEndpoint)
    SetIsLoginButtonInActiveState(() => false)
    Api({
      method: 'POST',
      endpoint: requestLogs.baseURL + requestLogs.loginEndpoint,
      payload: {
        password: loginPassword,
      },
    })
      .then((response) => {
        if (response.statusCode === 200) {
          localStorage.setItem('token', response.token)

          Store.addNotification({
            title: 'Success!',
            message: response.message,
            type: 'success',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          })

          navigate('/')
        } else {
          Store.addNotification({
            title: 'Failed!',
            message: response.message,
            type: 'danger',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          })
        }
      })
      .catch((error: Error) => {
        console.log(error)
        SetIsLoginButtonInActiveState(() => true)
      })
  }, [loginPassword])

  return (
    <>
      <div className="page-header"></div>
      <div className="row">
        <div className="card col-lg-4 mx-auto">
          <div className="card-body px-5 py-5">
            <h3 className="card-title text-left mb-3">Login</h3>
            <form>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="text"
                  className="form-control p_input"
                  onChange={(e) => SetLoginPassword(e.target.value)}
                />
                <p
                  className="mt-2 display-6"
                  style={{ fontSize: '10px', fontStyle: 'italic' }}
                >
                  Default password is 1234
                </p>
              </div>
              <div className="text-center">
                <button
                  disabled={!isLoginButtonInActiveState}
                  type="button"
                  className="btn btn-primary btn-block enter-btn"
                  onClick={onLoginSubmit}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
