import { transformRequest, transformResponse } from "./helpers/data";
import { processHeaders } from "./helpers/headers";
import { AxiosRequestConfig } from "./types";

const defaults: AxiosRequestConfig = {
    method: 'get',

    timeout: 0,

    headers: {
        common: {
            Accpet: 'application/json, text/plain, */*'
        }
    },

    transformRequest: [
        function (data: any, headers: any): any {
            processHeaders(headers, data)
            return transformRequest(data)
        }
    ],

    trasformResponse: [
        function (data: any): any {
            return transformResponse(data)
        }
    ],

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    validateStatus(status: number): boolean {
        return status >= 200 && status <300
    }

}

const methodsNoData = ['get', 'delete', 'head', 'options']
methodsNoData.forEach(method => {
    defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults
