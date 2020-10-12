import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/headers'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken, withCredentials, xsrfHeaderName, xsrfCookieName, onDownloadProgress, onUploadProgress, auth, validateStatus } = config

        const request = new XMLHttpRequest()

        configureRequest()

        request.open(method.toUpperCase(), url!, true)

        addEvents()

        processHeaders()

        processCancel()

        request.send(data)

        // 代码块优化
        function configureRequest(): void {
            if (responseType) {
                request.responseType = responseType
            }

            if (timeout) {
                request.timeout = timeout
            }

            if (withCredentials) {
                request.withCredentials = withCredentials
            }
        }

        function addEvents(): void {
            request.onreadystatechange = function handleLoad () {
                if (request.readyState !== 4) {
                    return
                }

                if (request.status === 0) {
                    return
                }

                const responseHeaders = parseHeaders(request.getAllResponseHeaders())
                const responseData = responseType !== 'text' ? request.response : request.responseText

                const response: AxiosResponse = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config,
                    request
                }

                handleResponse(response)
            }

            request.onerror = function handleError () {
                // reject(new Error('Network Error'))
                reject(createError('Network Error', config, null, request))
            }

            request.ontimeout = function handleTimeout () {
                // reject(new Error(`Timeout of ${request.timeout} ms exceeded`))
                reject(createError(`Timeout of ${request.timeout} ms exceeded`, config, 'ABORT', request))
            }

            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }

            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }

        function processHeaders(): void {
            if (isFormData(data)) {
                delete headers['Content-Type']
            }

            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName)

                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue
                }
            }

            if (auth) {
                headers['Authorization'] = 'Basic '+ btoa(auth.username + '.' + auth.password)
            }

            Object.keys(headers).forEach(name => {
                if ( data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }
            })
        }

        function processCancel(): void {
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    request.abort()
                    reject(reason)
                })
            }
        }

        function handleResponse (response: AxiosResponse): void {
            if (!validateStatus || validateStatus(response.status)){
                resolve(response)
            } else {
                // reject(new Error(`Request faild with status code ${response.status}`))
                reject(createError(`Request faild with status code ${response.status}`, config, null, request, response))
            }
        }
    })
}
