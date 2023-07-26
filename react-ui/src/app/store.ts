import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import { Reducer as RequestLogsReducer } from '../store/request-logs.store'

export const store = configureStore({
  reducer: {
    RequestLogs: RequestLogsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
