import { useNavigate } from "react-router-dom";

export function useClickNavigate() {
    const navigate = useNavigate()

    const handleSingerClick = (id) => {
        navigate(`/singerDetail/${id}`)
    }

    const handleSingerSongClick = (id) => {
        navigate(`/singerDetail/${id}/song`)
    }

    const handleSingerAlbumClick = (id) => {
        navigate(`/singerDetail/${id}/album`)
    }

    const handleSingerMVClick = (id) => {
        navigate(`/singerDetail/${id}/mv`)
    }

    const handleAlbumClick = (id) => {
        navigate(`/albumDetail/${id}`)
    }

    const handleSongClick = (id) => {
        navigate(`/songDetail/${id}`)
    }

    return {
        handleSingerClick, handleSingerSongClick, handleSingerAlbumClick, handleSingerMVClick,
        handleAlbumClick, handleSongClick
    };
}