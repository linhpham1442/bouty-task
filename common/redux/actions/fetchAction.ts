import { getTypeClear, getTypeFail, getTypeSuccess, getTypeUpdate } from '../utils'

export const fetchData = (type: string, func: any) => {
  return (dispatch: any) => {
    dispatch(fetchLoading(type))

    return func()
      .then((response: any) => {
        let data = response.data
        if (Array.isArray(data)) data = { data }
        dispatch(fetchSuccess(type, data))
      })
      .catch((error: any) => {
        dispatch(fetchError(type, error))
      })
  }
}

export const fetchLoading = (type: string) => {
  return { type: type }
}

export const fetchSuccess = (type: string, payload: any) => {
  return { type: getTypeSuccess(type), payload }
}

export const fetchError = (type: string, payload: any) => {
  return { type: getTypeFail(type), payload }
}

export const updateAction = (type: string, payload: any) => {
  return { type: getTypeUpdate(type), payload }
}

export const clearAction = (type: string) => {
  return { type: getTypeClear(type) }
}
