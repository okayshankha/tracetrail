import './filter.css'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  Actions as RequestLogsActions,
  Selector as RequestLogsSelector,
} from '../../../store/request-logs.store'
import _ from 'lodash'
import { useRef, useState } from 'react'

export default function StatusCodeFilterDropdown() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [CurrentStatusCodeInputValue, SetCurrentStatusCodeInputValue] =
    useState<string>('')

  const requestLogs = useAppSelector(RequestLogsSelector)
  const dispatch = useAppDispatch()

  const SetDropdownVisibility = (value: boolean) => {
    dispatch(RequestLogsActions.SetStatusCodeFilterDropdownVisibility(value))
  }
  const onChangeInputValue = (value: string) => {
    if (value.length >= 4) {
      value = value.substring(0, 3)
    }

    if (value.length >= 3) {
      if (value === 'ALL') {
        SetCurrentStatusCodeInputValue('')
        value = 'ALL'
      }

      if (_.inRange(+value, 100, 600)) {
        SetStatusCodeFilterDropdown(value)
      }
    }
    SetCurrentStatusCodeInputValue(value)
  }

  const SetStatusCodeFilterDropdown = (value: string) => {
    return dispatch(RequestLogsActions.SetStatusCodeFilterDropdown(value))
  }

  return (
    <div
      className={`col-3 dropdown ${
        requestLogs.dropdowns.statusCodeFilter.visible ? 'show' : ''
      }`}
      onClick={() => {
        inputRef.current?.focus()
      }}
    >
      <button
        className="btn btn-xs dropdown-toggle"
        type="button"
        onClick={() => {
          dispatch(
            RequestLogsActions.SetStatusCodeFilterDropdownVisibility(false),
          )
          SetDropdownVisibility(!requestLogs.dropdowns.methodFilter.visible)
          setTimeout(() => {
            inputRef.current?.click()
            buttonRef.current?.click()
          }, 100)
        }}
      >
        {requestLogs.dropdowns.statusCodeFilter.value}
      </button>

      <div
        className={`dropdown-menu ${
          requestLogs.dropdowns.statusCodeFilter.visible ? 'show' : ''
        }`}
        style={{
          position: 'absolute',
          transform: 'translate3d(10px, 12px, 15px)',
          top: '0px',
          left: '0px',
          willChange: 'transform',
        }}
        onBlurCapture={() => {
          setTimeout(() => {
            SetDropdownVisibility(false)
            SetCurrentStatusCodeInputValue('')
          }, 200)
        }}
      >
        <span
          className="dropdown-item"
          style={{ fontSize: '10px' }}
          onClick={() => SetStatusCodeFilterDropdown('ALL')}
        >
          ----ALL----
        </span>
        <span
          className="dropdown-item"
          style={{ fontSize: '10px' }}
          onClick={() => SetStatusCodeFilterDropdown('200')}
        >
          200
        </span>
        <span
          className="dropdown-item"
          style={{ fontSize: '10px' }}
          onClick={() => SetStatusCodeFilterDropdown('201')}
        >
          201
        </span>
        <span
          className="dropdown-item"
          style={{ fontSize: '10px' }}
          onClick={() => SetStatusCodeFilterDropdown('400')}
        >
          400
        </span>
        <span
          className="dropdown-item"
          style={{ fontSize: '10px' }}
          onClick={() => SetStatusCodeFilterDropdown('401')}
        >
          401
        </span>
        <span
          className="dropdown-item"
          style={{ fontSize: '10px' }}
          onClick={() => SetStatusCodeFilterDropdown('409')}
        >
          409
        </span>
        <span
          className="dropdown-item"
          style={{ fontSize: '10px' }}
          onClick={() => SetStatusCodeFilterDropdown('422')}
        >
          422
        </span>
        <span
          className="dropdown-item"
          style={{ fontSize: '10px' }}
          onClick={() => SetStatusCodeFilterDropdown('500')}
        >
          500
        </span>

        <input
          autoFocus
          ref={inputRef}
          value={CurrentStatusCodeInputValue}
          onChange={(event) => onChangeInputValue(event.target.value)}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              inputRef?.current?.blur()
            }
          }}
          className="dropdown-item"
          type="text"
          name="statueCode"
          placeholder="Ex.: 200, 401"
          style={{ fontSize: '10px', color: 'white' }}
        />
      </div>
    </div>
  )
}
