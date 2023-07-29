import RequestList from '../../components/request-list'
import RequestDetails from '../../components/request-details'
import './main-page.css'
import { useEffect } from 'react'
import Api from '../../helpers/api'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  Actions as RequestLogsActions,
  Selector as RequestLogsSelector,
} from '../../store/request-logs.store'

export default function MainPage() {
  const requestLogs = useAppSelector(RequestLogsSelector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    Api({
      method: 'GET',
      endpoint: requestLogs.npm.registryUrl,
    })
      .then((response) => {
        if (response.version) {
          dispatch(RequestLogsActions.SetLatestPackageVersion(response.version))
        }
      })
      .catch((error: Error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <div className="page-header"></div>

      <div className="row">
        <div className="col-lg-4 stretch-card mb-2">
          <RequestList></RequestList>
        </div>
        <div className="col-lg-8 stretch-card mb-2">
          <RequestDetails></RequestDetails>
        </div>
      </div>

      <div
        hidden={!requestLogs.npm.showVersionUpdateBanner}
        className={'preview-item-content badge badge-outline-warning'}
        style={{
          bottom: 0,
          position: 'fixed',
          fontWeight: 'bold',
          padding: '8px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        New version is available: &nbsp;
        <a href={requestLogs.npm.npmUrl} target="_blank">
          {requestLogs.npm.currentPackageVersion}
          &nbsp;{' ➜ '}&nbsp;
          {requestLogs.npm.latestPackageVersion}
        </a>
      </div>
    </>
  )
}
