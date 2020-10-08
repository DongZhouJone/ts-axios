import { AxiosRequestConfig } from './types'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): void {
    prcessConfig(config)
    xhr(config)
}

function prcessConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.data = transformRequestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
    const {url, params} = config
    return buildURL(url, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}
export default axios
