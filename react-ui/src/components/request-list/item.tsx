import Icon from '@mdi/react'
import { mdiApi } from '@mdi/js'
import './item.css'
import _ from 'lodash'
import { FormatTime } from '../../helpers/date'
import { useAppSelector } from '../../app/hooks'
import { Selector as RequestLogsSelector } from '../../store/request-logs.store'
import { useRef } from 'react'

function TaskItem(props: any) {
  const itemRef = useRef<any>(null)
  const requestLogs = useAppSelector(RequestLogsSelector)

  const OnClickScrollHandler = () => {
    itemRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }

  const RequestCreationTime = (isoString: string): string => {
    let readableTime = 'Time is not available!'

    readableTime = FormatTime(isoString)
    return readableTime
  }

  const {
    _id,
    createdAt,
    statusCode,
    timeTakenInMilliseconds = 0,
    endpoint = 'Something went wrong!',
    method = 'GET',
    onClick = () => {
      console.log('No click handler passed!')
    },
  } = props

  return (
    <div
      ref={itemRef}
      className="preview-item"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        onClick()
        OnClickScrollHandler()
      }}
    >
      <div className="preview-thumbnail">
        <div
          className={`preview-icon ${
            requestLogs?.selectedRecord?._id === _id ? 'bg-primary' : ''
          }`}
        >
          <Icon path={mdiApi} size={1} />
        </div>
      </div>
      <div className="preview-item-content d-sm-flex flex-grow">
        <div className="flex-grow">
          <div
            className="display-4 preview-subject mb-1"
            style={{ fontSize: '13px' }}
          >
            {_.inRange(statusCode, 0, 200) && (
              <div
                className={'badge badge-outline-primary'}
                style={{ padding: '6px' }}
              >
                {statusCode}
              </div>
            )}
            {_.inRange(statusCode, 200, 300) && (
              <div
                className={'badge badge-outline-success'}
                style={{ padding: '6px' }}
              >
                {statusCode}
              </div>
            )}
            {_.inRange(statusCode, 300, 400) && (
              <div
                className={'badge badge-outline-primary'}
                style={{ padding: '6px' }}
              >
                {statusCode}
              </div>
            )}
            {_.inRange(statusCode, 400, 500) && (
              <div
                className={'badge badge-outline-warning'}
                style={{ padding: '6px' }}
              >
                {statusCode}
              </div>
            )}
            {_.inRange(statusCode, 500, 600) && (
              <div
                className={'badge badge-outline-danger'}
                style={{ padding: '6px' }}
              >
                {statusCode}
              </div>
            )}
            {_.inRange(statusCode, 600, Infinity) && (
              <div
                className={'badge badge-outline-primary'}
                style={{ padding: '6px' }}
              >
                {statusCode}
              </div>
            )}
            &nbsp;&nbsp;
            <span style={{ fontSize: '12px' }}>
              {timeTakenInMilliseconds} ms
            </span>
            <div className="mt-1 text-sm-right pt-2 pt-sm-0 float-right">
              {method === 'GET' && (
                <div className="badge badge-success">{method}</div>
              )}
              {method === 'POST' && (
                <div className="badge badge-warning">{method}</div>
              )}
              {method === 'PATCH' && (
                <div className="badge badge-info">{method}</div>
              )}
              {method === 'PUT' && (
                <div className="badge badge-secondary">{method}</div>
              )}
              {method === 'DELETE' && (
                <div className="badge badge-danger">{method}</div>
              )}
            </div>
            <div className="mt-1" style={{ fontSize: '10px' }}>
              {RequestCreationTime(createdAt)}
            </div>
          </div>

          <p
            className="text-muted mb-0"
            style={{
              fontSize: '11px',
              lineHeight: '1.01rem',
              wordBreak: 'break-all',
            }}
          >
            {endpoint}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TaskItem
