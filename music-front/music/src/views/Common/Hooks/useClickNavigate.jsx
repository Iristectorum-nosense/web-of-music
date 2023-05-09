import { useNavigate } from "react-router-dom";
import { setPlayMVCount } from "../../../api/mv";

export function useClickNavigate() {
    const navigate = useNavigate()

    const playCount = async (id) => {
        await setPlayMVCount(id)
    }

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

    const handleMVClick = (id) => {
        playCount(id)
        navigate(`/mvDetail/${id}`)
    }

    return {
        handleSingerClick, handleSingerSongClick, handleSingerAlbumClick, handleSingerMVClick,
        handleAlbumClick, handleSongClick, handleMVClick
    };
}