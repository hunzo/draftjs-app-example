import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import HandleTokenHeader from './HandleTokenHeader'

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  //console.info(`[request] [${JSON.stringify(config, null, 2)}]`)
  if (config.headers) {
    config.headers.authorization = `Bearer ${HandleTokenHeader()}`
  }
  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`)
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  //console.info(`[response] [${JSON.stringify(response, null, 2)}]`)
  if (response.status === 401) console.log('hey error')
  console.log(`response status: ${JSON.stringify(response.status)}`)
  return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  // console.error(`[response error] [${JSON.stringify(error)}]`)
  if (error.response?.status === 401) {
    alert('UnAuthorized!!!')
    localStorage.clear()
  }
  return Promise.reject(error)
}

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)
  return axiosInstance
}
