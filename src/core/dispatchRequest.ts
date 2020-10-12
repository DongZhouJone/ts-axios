import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { buildURL, combineURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import {flattenHeaders, processHeaders} from '../helpers/headers'
import xhr from './xhr'
import transform from './transform'
import { isAbsolute } from 'path'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config)
    prcessConfig(config)
    return xhr(config).then(res => {
        return transformResponseData(res)
    })
}

function prcessConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.data = transform(config.data, config.headers, config.trasformRequest)
    config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
    let {url, params, paramsSerializer, baseURL} = config
    if (baseURL && !isAbsolute(url!)) {
        url = combineURL(baseURL, url)
    }
    return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.trasformResponse)
    return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}
