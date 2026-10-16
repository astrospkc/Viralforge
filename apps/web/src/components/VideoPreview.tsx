
// import ReactPlayer from 'react-player'
const VideoPreview = ({ videoUrl }: { videoUrl: string }) => {
    return (
        <div>
            {videoUrl}
            {/* <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls={true}
            /> */}
        </div>
    )
}

export default VideoPreview