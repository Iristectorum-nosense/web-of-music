
const staticBaseURL = 'http://localhost:8000'
export function SongImgURL(url, id) {
    return `${staticBaseURL}${url}/${id}.png`
}

export function SongLyricURL(id) {
    return `${staticBaseURL}/media/song/${id}.txt`
}

export function SongMp3URL(url, id) {
    return `${staticBaseURL}${url}/${id}.mp3`
}

export function SingerImgURL(url, id) {
    return `${staticBaseURL}${url}/${id}.png`
}

export function MVImgURL(url, id) {
    return `${staticBaseURL}${url}/mask/${id}.png`
}

export function AlbumImgURL(url, id) {
    return `${staticBaseURL}${url}/${id}.png`
}

export function MVMp4URL(url, id) {
    return `${staticBaseURL}${url}/${id}.mp4`
}

export function MVWebmURL(url, id) {
    return `${staticBaseURL}${url}/${id}.webm`
}

export function MVOggURL(url, id) {
    return `${staticBaseURL}${url}/${id}.ogg`
}
