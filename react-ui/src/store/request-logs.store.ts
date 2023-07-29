import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../app/store'

export interface RequestLogState {
  npm: {
    npmUrl: string
    registryUrl: string
    showVersionUpdateBanner: boolean
    currentPackageVersion: string | null
    latestPackageVersion: string | null
  }
  lastUpdated: number
  prevStartIndex: number
  startIndex: number
  itemsPerPage: number
  totalItems: number
  selectedRecord: any
  baseURL: string
  endpoint: string
  records: any[]
  dropdowns: {
    methodFilter: {
      visible: boolean
      value: string
    }
    statusCodeFilter: {
      visible: boolean
      value: string
    }
  }
}

/**
 *
 * If you need specific endpoint for local development,
 * create .env in the project root folder and add the following line
 *
 * REACT_APP_API_BASE_URL=http://localhost:4444/tracetrail/
 *
 */
const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? ''

const initialState: RequestLogState = {
  npm: {
    npmUrl: 'https://www.npmjs.com/package/tracetrail',
    registryUrl: 'https://registry.npmjs.org/tracetrail/latest',
    showVersionUpdateBanner: false,
    currentPackageVersion: null,
    latestPackageVersion: null,
  },
  lastUpdated: Date.now(),
  prevStartIndex: 1,
  startIndex: 1,
  itemsPerPage: 0,
  totalItems: 0,
  selectedRecord: null,
  records: [],
  endpoint: 'api/requests',
  dropdowns: {
    methodFilter: {
      visible: false,
      value: 'ALL',
    },
    statusCodeFilter: {
      visible: false,
      value: 'ALL',
    },
  },
  baseURL: BASE_URL,
}

export function FindRecordById(records: any[], id: string) {
  const existingRecord: { index: number; record: any } | undefined =
    records.find((e, index) => {
      if (e._id === id) {
        return {
          index,
          record: e,
        }
      } else {
        return null
      }
    })
  return existingRecord
}

export const RequestLogsSlice = createSlice({
  name: 'RequestLogs',
  initialState,
  reducers: {
    GoToNextPage: (state) => {
      state.startIndex = state.startIndex + state.itemsPerPage
    },
    GoToPreviousPage: (state) => {
      state.startIndex = state.startIndex - state.itemsPerPage
    },

    AddRecords: (state, action: PayloadAction<any>) => {
      const { startIndex, itemsPerPage, totalItems, records, version } =
        action.payload
      state.records = records
      state.startIndex = startIndex
      state.totalItems = totalItems
      state.itemsPerPage = itemsPerPage
      state.lastUpdated = Date.now()

      state.npm.currentPackageVersion = version
      if (state.npm.latestPackageVersion) {
        state.npm.showVersionUpdateBanner =
          state.npm.currentPackageVersion !== state.npm.latestPackageVersion
      }

      if (records.length > 0) {
        state.prevStartIndex = state.startIndex
      } else {
        state.startIndex = state.prevStartIndex
      }
    },

    SetSelectedRecord: (state, action: PayloadAction<any>) => {
      const _request: any = action.payload
      state.selectedRecord = FindRecordById(state.records, _request)
    },

    SetMethodFilterDropdownVisibility: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.dropdowns.methodFilter.visible = action.payload
    },
    SetMethodFilterDropdown: (state, action: PayloadAction<string>) => {
      state.startIndex = 1
      state.dropdowns.methodFilter.value = action.payload
    },

    SetStatusCodeFilterDropdownVisibility: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.dropdowns.statusCodeFilter.visible = action.payload
    },
    SetStatusCodeFilterDropdown: (state, action: PayloadAction<string>) => {
      state.startIndex = 1
      state.dropdowns.statusCodeFilter.value = action.payload
    },

    SetLatestPackageVersion: (state, action: PayloadAction<string>) => {
      state.npm.latestPackageVersion = action.payload
      if (state.npm.currentPackageVersion) {
        state.npm.showVersionUpdateBanner =
          state.npm.currentPackageVersion !== state.npm.latestPackageVersion
      }
    },
  },
})

export const Actions = RequestLogsSlice.actions

export const Selector = (state: RootState) => state.RequestLogs

export const Reducer = RequestLogsSlice.reducer
