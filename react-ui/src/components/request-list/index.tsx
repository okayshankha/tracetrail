import ListItem from "./item";
import { mdiArrowLeftBoldCircle, mdiArrowRightBoldCircle, mdiWifi, mdiWifiOff } from '@mdi/js';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    Actions as RequestLogsActions,
    Selector as RequestLogsSelector
} from '../../store/request-logs.store'
import Icon from "@mdi/react";
import { useCallback, useEffect } from "react";
import Api from "../../helpers/api";
import MethodFilterDropdown from "./dropdowns/method.filter";
import StatusCodeFilterDropdown from "./dropdowns/status-code.filter";
import _ from "lodash";



sessionStorage.clear()


const REFRESH_IN_SECONDS = 5
const FETCH_DATA_IN_PROGRESS = (Math.random() + 1).toString(36).substring(7)

const MethodFilterDropdownValues = {
    'ALL': '----ALL----',
    'GET': 'GET',
    'POST': 'POST',
    'PUT': 'PUT',
    'PATCH': 'PATCH',
    'DELETE': 'DELETE',
}


export default function RequestList() {

    const requestLogs = useAppSelector(RequestLogsSelector)
    const dispatch = useAppDispatch()

    const onListItemClickHandler = (_id: string) => {
        dispatch(RequestLogsActions.SetSelectedRecord(_id))
    }

    const gotoPreviousPage = () => {
        dispatch(RequestLogsActions.GoToPreviousPage())
    }

    const gotoNextPage = () => {
        dispatch(RequestLogsActions.GoToNextPage())
    }


    const FetchData = useCallback(async (startIndex: number = 1) => {

        if (sessionStorage.getItem(FETCH_DATA_IN_PROGRESS) === 'true') {
            return
        }

        sessionStorage.setItem(FETCH_DATA_IN_PROGRESS, 'true')

        Api({
            method: 'GET',
            endpoint: requestLogs.baseURL + requestLogs.endpoint,
            params: _.omitBy({
                startIndex,
                method: requestLogs.dropdowns.methodFilter.value !== 'ALL' ? requestLogs.dropdowns.methodFilter.value : null,
                statusCode: requestLogs.dropdowns.statusCodeFilter.value !== 'ALL' ? requestLogs.dropdowns.statusCodeFilter.value : null,
            }, _.isNil)
        }).then(requestLogList => {
            dispatch(
                RequestLogsActions.AddRecords({
                    startIndex: requestLogList.startIndex,
                    itemsPerPage: requestLogList.itemsPerPage,
                    totalItems: requestLogList.totalItems,
                    records: requestLogList.items
                })
            )
        }).catch((error: Error) => {
            console.log(error)
        }).finally(() => {
            sessionStorage.setItem(FETCH_DATA_IN_PROGRESS, 'false')
        })

    }, [dispatch, requestLogs.endpoint, requestLogs.dropdowns, requestLogs.baseURL])


    useEffect(() => {

        let timerRef: NodeJS.Timeout | null | undefined = null
        if (requestLogs.startIndex === 1) {
            timerRef = setTimeout(async () => {
                await FetchData(requestLogs.startIndex)
            }, 1000 * REFRESH_IN_SECONDS)
        }

        return () => {
            if (timerRef) {
                return clearTimeout(timerRef)
            }
        }
    }, [requestLogs.dropdowns, requestLogs.lastUpdated, FetchData, requestLogs.startIndex])

    useEffect(() => {
        FetchData(requestLogs.startIndex)
    }, [
        FetchData,
        requestLogs.startIndex,
        requestLogs.dropdowns.methodFilter.value,
        requestLogs.dropdowns.statusCodeFilter.value
    ])

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex flex-row justify-content-between">
                    <h4 className="card-title mb-1 display-4">Requests</h4>

                    <div className="float-right mt-1">

                        {
                            requestLogs.startIndex === 1
                                ? <Icon path={mdiWifi} size={0.7} title={'Live'} />
                                : <Icon path={mdiWifiOff} size={0.7} title={'Static'} />
                        }


                        <button
                            className="btn p-1"
                            onClick={gotoPreviousPage}
                            disabled={requestLogs.startIndex === 1}
                        >
                            <Icon path={mdiArrowLeftBoldCircle} size={1} />
                        </button>
                        <button
                            className="btn p-1"
                            onClick={gotoNextPage}
                            disabled={requestLogs.totalItems < requestLogs.startIndex + requestLogs.itemsPerPage}
                        >
                            <Icon path={mdiArrowRightBoldCircle} size={1} />
                        </button>
                    </div>
                </div>
                <p className="display-4 m-0" style={{ fontSize: '11px' }}>
                    Showing {requestLogs.totalItems ? requestLogs.startIndex : 0} - {Math.min(requestLogs.totalItems, requestLogs.startIndex + requestLogs.itemsPerPage - 1)} of {requestLogs.totalItems} records
                </p>

                <div className="row">
                    <div className="col-12">
                        <div className="row">

                            <MethodFilterDropdown dropdownValues={MethodFilterDropdownValues}></MethodFilterDropdown>
                            <StatusCodeFilterDropdown></StatusCodeFilterDropdown>

                        </div>
                    </div>

                    {
                        (requestLogs.records.length === 0) &&
                        <div className="row h-100 w-100">
                            <div className="col-sm-12 w-100 h-100 mt-5 d-table text-center">
                                <div className="card card-block d-table-cell align-middle">
                                    Nothing to show here
                                </div>
                            </div>
                        </div>
                    }

                    {
                        (requestLogs.records.length !== 0) &&
                        <>
                            <div className="col-12 custom-card-height">

                                <div className="preview-list">
                                    {
                                        requestLogs.records.map(
                                            e =>
                                                <ListItem
                                                    key={e._id}
                                                    {...e}
                                                    onClick={() => onListItemClickHandler(e._id)}
                                                >
                                                </ListItem>
                                        )
                                    }
                                </div>
                            </div>

                        </>
                    }
                </div>
            </div>
        </div >
    )
}