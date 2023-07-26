import './filter.css'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  Actions as RequestLogsActions,
  Selector as RequestLogsSelector,
} from '../../../store/request-logs.store'

export default function MethodFilterDropdown({
  dropdownValues = {},
}: {
  dropdownValues?: { [key: string]: string }
}) {
  const requestLogs = useAppSelector(RequestLogsSelector)
  const dispatch = useAppDispatch()

  const SetDropdownVisibility = (value: boolean) => {
    dispatch(RequestLogsActions.SetMethodFilterDropdownVisibility(value))
  }
  const SetDropdownValue = (value: string) => {
    dispatch(RequestLogsActions.SetMethodFilterDropdown(value))
  }

  return (
    <div
      className={`col-3 dropdown ${
        requestLogs.dropdowns.methodFilter.visible ? 'show' : ''
      }`}
    >
      <button
        className="btn btn-xs dropdown-toggle"
        type="button"
        onClick={() => {
          dispatch(
            RequestLogsActions.SetStatusCodeFilterDropdownVisibility(false),
          )
          SetDropdownVisibility(!requestLogs.dropdowns.methodFilter.visible)
        }}
        onBlurCapture={() => {
          setTimeout(() => SetDropdownVisibility(false), 200)
        }}
      >
        {requestLogs.dropdowns.methodFilter.value}
      </button>
      <div
        className={`dropdown-menu ${
          requestLogs.dropdowns.methodFilter.visible ? 'show' : ''
        }`}
        style={{
          position: 'absolute',
          transform: 'translate3d(10px, 12px, 15px)',
          top: '0px',
          left: '0px',
          willChange: 'transform',
        }}
      >
        {Object.keys(dropdownValues).map((dropdownKey: string) => (
          <span
            key={dropdownKey}
            className="dropdown-item"
            style={{ fontSize: '10px' }}
            onClick={() => SetDropdownValue(dropdownKey)}
          >
            {dropdownValues[dropdownKey]}
          </span>
        ))}
      </div>
    </div>
  )
}
