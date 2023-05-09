//防抖，立即触发
export function debounceNow(fuc, wait) {
    let timeout
    return function () {
        let context = this
        let args = arguments
        if (timeout) clearTimeout(timeout)
        const callNow = !timeout
        timeout = setTimeout(() => {
            timeout = null
        }, wait)
        if (callNow) fuc.apply(context, args)
    }
}

//防抖，延迟触发
export function debounceDelay(fuc, wait) {
    let timeout
    return function () {
        let context = this
        let args = arguments
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            fuc.apply(context, args)
        }, wait)
    }
}