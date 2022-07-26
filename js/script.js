// let's select all required tags or elements
const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    musicList = wrapper.querySelector(".music-list"),
    hideMusicBtn = musicList.querySelector("#close"),
    ulTag = musicList.querySelector("ul");

let musicIndex = 0;

window.addEventListener("load", () => {
    loadMusic(musicIndex); //calling load music function once window loaded
    render(); //Load music list
});

// Load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb].name;
    musicArtist.innerText = allMusic[indexNumb].artist;
    musicImg.src = allMusic[indexNumb].image;
    mainAudio.src = `../songs/${allMusic[indexNumb].path}.mp3`;
}

/**
 * Functions
 */

// Play musci function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// Pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// Next music function
function nextMusic() {
    musicIndex++;
    if (musicIndex === allMusic.length) {
        musicIndex = 0;
    }
    activeSongPlaying();
    loadMusic(musicIndex);
    playMusic();
}

// prev music function
function prevMusic() {
    musicIndex--;
    musicIndex < 0
        ? (musicIndex = allMusic.length - 1)
        : (musicIndex = musicIndex);
    activeSongPlaying();
    loadMusic(musicIndex);
    playMusic();
}

// Repeat one Song function
function repeatOneSong() {
    mainAudio.currentTime = 0;
    playMusic();
}

// Shuffle playlist
function shufflePlaylist() {
    let randIndex;
    do {
        randIndex = Math.floor(Math.random() * allMusic.length);
    } while (musicIndex == randIndex);
    musicIndex = randIndex;
    activeSongPlaying();
    loadMusic(musicIndex);
    playMusic();
}

// convert time song
function convertTime(time) {
    let min = Math.floor(time / 60);
    let second = Math.floor(time % 60);

    // adding 0 if seccond is less then 10
    if (second < 10) {
        second = `0${second}`;
    }

    return `${min}:${second}`;
}

// Render music list
function render() {
    for (let index in allMusic) {
        let liTag = `
            <li data-id="${index}" class="song ${
            index == musicIndex ? "playing" : ""
        }">
                <div class="row">
                    <span>${allMusic[index].name}</span>
                    <p>${allMusic[index].artist}</p>
                </div>
                <audio class="audio-${index}" src="../songs/${
            allMusic[index].path
        }.mp3"></audio>
                <span id="audio-duration-${index}" class="audio-duration"></span>
            </li>
        `;
        ulTag.insertAdjacentHTML("beforeend", liTag);

        let liAudioTag = ulTag.querySelector(`.audio-${index}`);
        let liAudioDuration = ulTag.querySelector(`#audio-duration-${index}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = convertTime(liAudioTag.duration);
        });
    }
}

// active song playing
function activeSongPlaying() {
    // ulTag.click();
    const songs = ulTag.querySelectorAll("li");
    ulTag.querySelector(".song.playing").classList.remove("playing");
    for (let i in songs) {
        if (Number(i) === Number(musicIndex)) {
            songs[i].classList.add("playing");
        }
    }
}

function srollIntoView() {
    setTimeout(() => {
        ulTag.querySelector(".song.playing").scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, 300);
}

/**
 *  Event UI
 */
// rotate CD
const cdThumbAnimate = musicImg.animate(
    [
        {
            transform: "rotate(360deg)",
        },
    ],
    {
        duration: 10000, // 10 seconds
        iterations: Infinity,
    }
);

cdThumbAnimate.pause();

// Click btn Play/pause
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    if (isMusicPaused) {
        cdThumbAnimate.pause();
        pauseMusic();
    } else {
        cdThumbAnimate.play();
        playMusic();
    }
});

// event Click button next
nextBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    if (getText == "shuffle") {
        shufflePlaylist();
    } else {
        nextMusic();
    }
});

// event click button prev
prevBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    if (getText == "shuffle") {
        shufflePlaylist();
    } else {
        prevMusic();
    }
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    let progressPercent = (mainAudio.currentTime / mainAudio.duration) * 100;
    progressBar.style.width = progressPercent + "%";

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        // update song total duration
        musicDuration.innerText = convertTime(mainAudio.duration);
    });

    // update playing song current time
    musicCurrentTime.innerText = convertTime(mainAudio.currentTime);
});

// Seeking song
progressArea.addEventListener("click", (e) => {
    const progressAreaWidth = progressArea.clientWidth;
    let progressPercent = (e.offsetX / progressAreaWidth) * 100;
    let seekTime = (progressPercent / 100) * mainAudio.duration;
    mainAudio.currentTime = seekTime;
    playMusic();
});

// event click button Repeat song
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Song shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

// after the song ended
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            repeatOneSong();
            break;
        case "shuffle":
            shufflePlaylist();
            break;
    }
});

// event click button show music list
let isShowMusicList = false;
showMoreBtn.addEventListener("click", () => {
    isShowMusicList = !isShowMusicList;
    musicList.classList.toggle("show");
    if (isShowMusicList) {
        srollIntoView();
    }
});

// event click button close music list
hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

// event Tag <ul> clicked
ulTag.addEventListener("click", (e) => {
    let songNode = e.target.closest("li");
    if (songNode) {
        ulTag.querySelector(".song.playing").classList.remove("playing");
        songNode.classList.add("playing");
        musicIndex = Number(songNode.dataset.id);
        loadMusic(musicIndex);
        playMusic();
    }
});
