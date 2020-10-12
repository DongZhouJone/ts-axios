const toStr = Object.prototype.toString

export function isDate(val: any): val is Date {
    return toStr.call(val) === '[object Date]'
}

export function isPlainObject(val: any): val is Object {
    return toStr.call(val) === '[object Object]'
}

export function isObject(val: object): val is Object {
    return val !== null && typeof val === 'object'
}

export function extend<T, U>(to: T, from: U): T & U {
    for (let key in from) {
        ;(to as T & U)[key] = from[key] as any
    }

    return to as T & U
}

// 深拷贝多个对象
export function deepMerge (...objs: any[]):any {
    const result = Object.create(null)

    objs.forEach(obj => {
        if (obj) {
            Object.keys(obj).forEach(key => {
                const val = obj[key]

                if (isPlainObject(val)) {
                    if (isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val)
                    } else {
                        result[key] = deepMerge(val)
                    }
                } else {
                    result[key] = val
                }
            })
        }
    })

    return result
}

export function isFormData(val: any): val is FormData {
    return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
    return typeof val !== 'undefined' && val instanceof URLSearchParams
}
