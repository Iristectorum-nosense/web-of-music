import { getLyric } from "../api/song"

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

//处理歌词文本
export function formatLyric(text) {
    const lyricPattern = /\[[^\]]*\]/g
    let result = text.replace(lyricPattern, '\n')
    return result;
}