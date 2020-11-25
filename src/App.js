import React, { useState, useRef } from 'react'
// import styles
import './styles/app.scss'

// adding components
import Player from './components/Player'
import Song from './components/Song'
import Library from './components/Library'
import Nav from './components/Nav'

import data from './data'

function App() {
    // Ref
    const audioRef = useRef(null)

    const [songs, setSongs] = useState(data())
    const [currentSong, setCurrentSong] = useState(songs[0])
    const [isPlaying, setIsPlaying] = useState(false)
    const [songInfo, setSongInfo] = useState({
        currentTime: 0,
        duration: 0,
        animationPercentage: 0
    })
    const [libraryStatus, setLibraryStatus] = useState(false)

    const timeUpdateHandler = (e) => {
        const current = e.target.currentTime
        const duration = e.target.duration
        //calc perc       
        const roundedCurrent = Math.round(current)
        const roundedDuration = Math.round(duration)
        const animation = Math.round((roundedCurrent / roundedDuration) * 100)
        
        setSongInfo({ ...songInfo, currentTime: current, duration: duration, animationPercentage: animation})
    }

const songEndHandler = async () => {
    let currentIndex = songs.findIndex(song => song.id === currentSong.id)
    await setCurrentSong(songs[(currentIndex + 1) % songs.length])

    isPlaying && audioRef.current.play()
}

  return (
    <div className={`App ${libraryStatus && 'library-active'}`}>
        <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
        <Song currentSong={currentSong}/>
        <Player 
            audioRef={audioRef}
            setIsPlaying={setIsPlaying}
            isPlaying={isPlaying}
            songInfo={songInfo}
            setSongInfo={setSongInfo}
            songs={songs}
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            setSongs={setSongs}
        />

        <Library
            audioRef={audioRef}
            songs={songs}
            setCurrentSong={setCurrentSong} 
            isPlaying={isPlaying}
            setSongs={setSongs}
            libraryStatus={libraryStatus}
        />

        <audio 
            onTimeUpdate={timeUpdateHandler} 
            onLoadedMetadata={timeUpdateHandler}
            ref={audioRef} 
            src={currentSong.audio}
            onEnded={songEndHandler}
        ></audio>
    </div>
  );
}

export default App;
