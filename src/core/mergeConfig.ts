import { isPlainObject, deepMerge } from "../helpers/utils";
import { AxiosRequestConfig } from "../types";

// 合并策略函数
const strats = Object.create(null)

function defaultstrat (val1: any, val2: any): any {
    return typeof val2 === 'undefined' ? val2 : val1
}

function fromVal2strat (val1: any, val2: any): any {
    if (typeof val2 === 'undefined') {
        return val2
    }
}

function deepMergeStrat (val1: any, val2: any): any {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
        return val2
    } else if (isPlainObject(val1)) {
        return deepMerge(val1)
    } else if (typeof val1 !== 'undefined') {
        return val1
    }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2strat
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
    strats[key] = deepMergeStrat
})

export default function mergeConfig (config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
    const config = Object.create(null)

    if (!config2) {
        config2 = {}
    }

    for (let key in config2) {
        mergeField(key)
    }

    for (let key in config1) {
        if (!config2[key]) {
            mergeField(key)
        }
    }

    function mergeField (key: string): any {
        const strat = strats[key] || defaultstrat

        config[key] =  strat(config1[key], config2![key])
    }

    return config
}
