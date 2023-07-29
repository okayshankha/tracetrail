import { useAppSelector } from '../../app/hooks'
import { Selector as RequestLogsSelector } from '../../store/request-logs.store'

import ReactJson from 'react-json-view'
import './request-details.css'
import { useState } from 'react'
import _ from 'lodash'
import Replay from './replay'

enum PayloadField {
  Headers = 'headers',
  Query = 'query',
  Body = 'body',
}

export default function RequestDetails() {
  const requestLogs = useAppSelector(RequestLogsSelector)

  const [selectedRequestPayloadField, setSelectedRequestPayloadField] =
    useState<string>(PayloadField.Body)
  const [selectedResponsePayloadField, setSelectedResponsePayloadField] =
    useState<string>(PayloadField.Body)

  if (requestLogs.selectedRecord === null) {
    return (
      <>
        <div className="card">
          <div className="card-body">
            <div className="row h-100 w-100">
              <div className="col-sm-12 w-100 h-100 d-table text-center">
                <div className="d-table-cell align-middle">
                  Nothing to show here
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex flex-row justify-content-between">
          <h4 className="card-title mb-1 display-4">Details</h4>
        </div>
        <div className="row">
          <div className="col-12 custom-card-height">
            <div className="preview-list">
              <div className="row mb-3">
                <div className="col-5 mt-2" style={{ fontSize: '16px' }}>
                  {requestLogs.selectedRecord.method}
                </div>

                <div className="col-2 mt-1" style={{ fontSize: '13px' }}>
                  {_.inRange(
                    requestLogs.selectedRecord.statusCode,
                    200,
                    300,
                  ) && (
                    <div
                      className={'badge badge-outline-success'}
                      style={{ padding: '6px' }}
                    >
                      {requestLogs.selectedRecord.statusCode}
                    </div>
                  )}
                  {_.inRange(
                    requestLogs.selectedRecord.statusCode,
                    300,
                    400,
                  ) && (
                    <div
                      className={'badge badge-outline-primary'}
                      style={{ padding: '6px' }}
                    >
                      {requestLogs.selectedRecord.statusCode}
                    </div>
                  )}
                  {_.inRange(
                    requestLogs.selectedRecord.statusCode,
                    400,
                    500,
                  ) && (
                    <div
                      className={'badge badge-outline-warning'}
                      style={{ padding: '6px' }}
                    >
                      {requestLogs.selectedRecord.statusCode}
                    </div>
                  )}
                  {_.inRange(
                    requestLogs.selectedRecord.statusCode,
                    500,
                    600,
                  ) && (
                    <div
                      className={'badge badge-outline-danger'}
                      style={{ padding: '6px' }}
                    >
                      {requestLogs.selectedRecord.statusCode}
                    </div>
                  )}
                </div>

                <div className="col-2 mt-2" style={{ fontSize: '13px' }}>
                  {requestLogs.selectedRecord.timeTakenInMilliseconds} ms
                </div>
                <div
                  className="col-3 align-middle"
                  style={{ fontSize: '13px', float: 'right' }}
                >
                  <Replay></Replay>
                </div>
              </div>
              <div className="row mb-3" style={{ marginTop: '0.3px' }}>
                <div
                  className="col-12"
                  style={{ fontSize: '13px', wordBreak: 'break-all' }}
                >
                  {requestLogs.selectedRecord.endpoint}
                </div>
              </div>

              <p className="display-4" style={{ fontSize: '18px' }}>
                Request
              </p>

              <div className="row">
                <div
                  className={`col-4 badge rounded-0 c-gradient ${
                    selectedRequestPayloadField === PayloadField.Headers
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedRequestPayloadField(PayloadField.Headers)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  Headers
                </div>
                <div
                  className={`col-4 badge rounded-0 c-gradient ${
                    selectedRequestPayloadField === PayloadField.Query
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedRequestPayloadField(PayloadField.Query)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  Query
                </div>
                <div
                  className={`col-4 badge rounded-0 c-gradient ${
                    selectedRequestPayloadField === PayloadField.Body
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedRequestPayloadField(PayloadField.Body)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  Body
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-12 flex-grow json-container">
                  {
                    <ReactJson
                      src={
                        requestLogs.selectedRecord.input[
                          selectedRequestPayloadField
                        ] ?? {}
                      }
                      name={null}
                      indentWidth={2}
                      theme="tube"
                      collapseStringsAfterLength={100}
                      collapsed={2}
                      displayDataTypes={false}
                      quotesOnKeys={false}
                    />
                  }
                </div>
              </div>

              <div className="mt-5"></div>

              <p className="display-4" style={{ fontSize: '18px' }}>
                Response
              </p>

              <div className="row">
                <div
                  className={`col-6 badge rounded-0 c-gradient ${
                    selectedResponsePayloadField === PayloadField.Headers
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedResponsePayloadField(PayloadField.Headers)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  Headers
                </div>
                <div
                  className={`col-6 badge rounded-0 c-gradient ${
                    selectedResponsePayloadField === PayloadField.Body
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedResponsePayloadField(PayloadField.Body)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  Body
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-12 flex-grow json-container">
                  {
                    <ReactJson
                      src={
                        requestLogs.selectedRecord.output[
                          selectedResponsePayloadField
                        ] ?? {}
                      }
                      name={null}
                      indentWidth={2}
                      theme="tube"
                      collapseStringsAfterLength={100}
                      collapsed={2}
                      displayDataTypes={false}
                      quotesOnKeys={false}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
