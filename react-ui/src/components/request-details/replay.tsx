import { mdiRotateRight } from '@mdi/js'
import Icon from '@mdi/react'
import { useAppSelector } from '../../app/hooks'
import { Selector as RequestLogsSelector } from '../../store/request-logs.store'
import Api from '../../helpers/api'
import { useState } from 'react'

export default function Replay() {
  const requestLogs = useAppSelector(RequestLogsSelector)

  const [ApiCallInProgress, SetApiCallInProgress] = useState<boolean>(false)

  const onReplay = async () => {
    if (requestLogs.selectedRecord) {
      SetApiCallInProgress(true)
      setTimeout(() => {
        let serverBaseURL = requestLogs.baseURL.trim()
        if (serverBaseURL !== '') {
          serverBaseURL = new URL(requestLogs.baseURL).origin
        }

        Api({
          method: requestLogs.selectedRecord.method,
          endpoint:
            serverBaseURL +
            '/' +
            requestLogs.selectedRecord.endpoint.replace(/^\//, ''),
          headers: requestLogs.selectedRecord.input.headers,
          payload: requestLogs.selectedRecord.input.body,
        }).then(() => {
          setTimeout(() => SetApiCallInProgress(false), 500)
        })
      }, 100)
    }
  }

  return (
    <div
      className={'btn btn-info p-2'}
      style={{ fontSize: '13px', marginTop: '0.5px' }}
      onClick={onReplay}
    >
      <Icon
        path={mdiRotateRight}
        size={0.6}
        spin={ApiCallInProgress}
        style={{ float: 'left', marginTop: '-1px', marginRight: '1px' }}
      />
      Replay
    </div>
  )
}
