import { createReducer } from '@reduxjs/toolkit'
import { getTypeClear, getTypeFail, getTypeSuccess, getTypeUpdate } from '../utils'

const initialState = {
  data: [] as any[],
  loading: false,
  error: null as any,
  success: null as any, //null -> not loading yet, true -> loading success, false -> loading error
}

const fetchReducer = (type: string, moreReducer = {}, moreInitState = {}) =>
  createReducer(
    { ...initialState, ...moreInitState },
    {
      [type]: (state: any, action: any) => {
        return {
          ...state,
          ...initialState,
          loading: true,
          data: state.data,
          paging: null,
        } 
      },
      [getTypeSuccess(type)]: (state: any, action: any) => {
        return {
          ...state,
          ...initialState,
          ...action.payload,
          success: true,
          loading: false,
        }
      },
      [getTypeFail(type)]: (state: any, action: any) => {
        return {
          ...state,
          ...initialState,
          error: action.payload,
          data: state.data,
          success: false,
          loading: false,
        }
      },
      [getTypeUpdate(type)]: (state: any, action: any) => {
        return {
          ...state,
          ...action.payload,
        }
      },
      [getTypeClear(type)]: (state: any, action: any) => {
        return {
          ...initialState,
        }
      },
      ...moreReducer,
    },
  )

export default fetchReducer
