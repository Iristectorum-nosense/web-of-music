//处理出版时间xxxx-xx-xx
export function formatPublish(time) {
    return new Date(time).toISOString().slice(0, 10)
}

//处理时长xx-xx
export function formatTime(time) {
    let minutes = time.slice(7, 9)
    let seconds = time.slice(10, 12)
    return minutes + ':' + seconds
}

//处理当前播放秒数xx-xx
export function formatSeconds(seconds) {
    if (seconds === -1) return '00:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = parseInt(seconds % 60)
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')
    return `${formattedMinutes}:${formattedSeconds}`
}

//处理总播放秒数xxxx
export function formatPlayTime(time) {
    let minutes = parseInt(time.slice(7, 9))
    let seconds = parseInt(time.slice(10, 12))
    return minutes * 60 + seconds
}

//处理歌词文本
export function formatLyric(text) {
    const lyricPattern = /\[[^\]]*\]/g
    let result = text.replace(lyricPattern, '\n')
    return result;
}

//处理滚动歌词文本
export function formatScrollLyric(text) {
    const lyricPattern = /\[[^\]]*\]/g

    const timeStr = text.match(lyricPattern)
    const timeArray = timeStr.map((time, index) => {
        let seconds = parseInt(time.slice(1, 3)) * 60 + parseInt(time.slice(4, 6))
        return { index, seconds }
    })

    const textStr = text.replace(lyricPattern, '')
    const textArray = textStr.split('\r\n').map((line, index) => {
        return { index, line }
    })

    const result = timeArray.map((time) => {
        const text = textArray.find((text) => text.index === time.index);
        return {
            id: time.index,
            seconds: time.seconds,
            line: text.line || '',
        }
    })

    return result;
}