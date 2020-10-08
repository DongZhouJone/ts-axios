import {isPlainObject} from './utils'

function normalizeHeaderName (headers: any, nomalizedName: string): void {
    if (!headers) {
        return
    }

    Object.keys(headers).forEach(name => {
        if (name !== nomalizedName && name.toUpperCase() === nomalizedName.toUpperCase()) {
            headers[nomalizedName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders (headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')

    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
}
