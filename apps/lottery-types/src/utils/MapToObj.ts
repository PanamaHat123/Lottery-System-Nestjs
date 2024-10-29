import {Decimal} from "decimal.js";

function mapToObj(map: Map<any, any>): object {
    const obj = {};
    for (let [k, v] of map) {
        // 如果值是Map，继续递归转换
        obj[k] = v instanceof Map ? mapToObj(v as Map<any, any>) : v;
    }
    return obj;
}

export function deepConvertMapsToObjects(obj: any): any {
    if (obj instanceof Map) {
        // 如果是Map，直接转换
        return mapToObj(obj as Map<any,any>);
    } else if (Array.isArray(obj)) {
        // 如果是数组，遍历每个元素
        return obj.map((item) => deepConvertMapsToObjects(item));
    }
    else if(obj instanceof Decimal){
        return obj.toNumber()
    }
    else if (typeof obj === 'object' && obj !== null) {
        // 如果是对象，遍历其属性
        const result: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = deepConvertMapsToObjects(obj[key]);
            }
        }
        return result;
    }
    // 如果不是对象或数组，直接返回原值
    return obj;
}

