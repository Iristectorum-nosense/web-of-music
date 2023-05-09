//节流，立即触发
export function throttleNow(fuc, wait) {
    var prev = 0;
    return function () {
        let context = this
        let args = arguments
        let now = Date.now()
        if (now - prev > wait) {
            fuc.apply(context, args)
            prev = now
        }
    }
}

//节流，延迟触发
export function throttleDelay(fuc, wait) {
    let timeout
    return function () {
        let context = this
        let args = arguments
        if (!timeout) {
            timeout = setTimeout(() => {
                fuc.apply(context, args)
                timeout = null
            }, wait)
        }
    }
}
