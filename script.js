const songs = [
    {
        title: "Tum Tum",
        artist: "SouthMelody",
        cover: "assets/art5.png",
        url: "https://res.cloudinary.com/djzf9kgjc/video/upload/q_auto/f_auto/v1778607485/Tum_Tum_-_SouthMelody_mxasyh.mp3"
    },
    {
        title: "Uyire Uyire",
        artist: "SouthMelody",
        cover: "assets/art2.png",
        url: "https://res.cloudinary.com/djzf9kgjc/video/upload/q_auto/f_auto/v1778605453/Uyire_Uyire_-_SouthMelody_qfwbgn.mp3"
    },
    {
        title: "SAMBAVA CLUB",
        artist: "SouthMelody",
        cover: "assets/art1.png",
        url: "https://res.cloudinary.com/djzf9kgjc/video/upload/q_auto/f_auto/v1778605453/SAMBAVA_CLUB_-_SouthMelody_ccy9aq.mp3"
    },
    {
        title: "IMAYE",
        artist: "SouthMelody",
        cover: "assets/art3.png",
        url: "https://res.cloudinary.com/djzf9kgjc/video/upload/q_auto/f_auto/v1778605453/IMAYE_-_SouthMelody_fih8e5.mp3"
    },
    {
        title: "Pesum Mazhai",
        artist: "SouthMelody",
        cover: "assets/art4.png",
        url: "https://res.cloudinary.com/djzf9kgjc/video/upload/q_auto/f_auto/v1778605452/Pesum_Mazhai_-_SouthMelody_kklf9d.mp3"
    }
];

let currentSongIndex = 0;
let isPlaying = false;
const audio = new Audio(songs[currentSongIndex].url);

// Elements
const playPauseBtn = document.getElementById('play-pause-container');
const playPauseIcon = document.getElementById('play-pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackArt = document.getElementById('current-art');
const trackTitle = document.getElementById('current-title');
const trackArtist = document.getElementById('current-artist');
const songCards = document.querySelectorAll('.song-card');

// Load song
function loadSong(index) {
    const song = songs[index];
    audio.src = song.url;
    trackArt.src = song.cover;
    trackTitle.innerText = song.title;
    trackArtist.innerText = song.artist;
    
    // Reset progress
    progressFill.style.width = '0%';
    currentTimeEl.innerText = '0:00';

    // Update active UI
    updateActiveCard(index);
}

// Update active card highlighting
function updateActiveCard(index) {
    songCards.forEach((card, i) => {
        if (i === index) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playPauseIcon.classList.replace('fa-pause', 'fa-play');
    } else {
        audio.play();
        playPauseIcon.classList.replace('fa-play', 'fa-pause');
    }
    isPlaying = !isPlaying;
}

// Update progress
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Format time
    const currentMin = Math.floor(audio.currentTime / 60);
    const currentSec = Math.floor(audio.currentTime % 60);
    currentTimeEl.innerText = `${currentMin}:${currentSec.toString().padStart(2, '0')}`;
    
    if (audio.duration) {
        const totalMin = Math.floor(audio.duration / 60);
        const totalSec = Math.floor(audio.duration % 60);
        totalTimeEl.innerText = `${totalMin}:${totalSec.toString().padStart(2, '0')}`;
    }
});

// Seek
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

// Controls
playPauseBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
});

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
});

// Search & Navigation
const navHome = document.getElementById('nav-home');
const navSearch = document.getElementById('nav-search');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const heroTitle = document.querySelector('.hero h1');

navSearch.addEventListener('click', () => {
    navSearch.classList.add('active');
    navHome.classList.remove('active');
    searchContainer.style.display = 'flex';
    heroTitle.innerText = 'Search Results';
    searchInput.focus();
});

navHome.addEventListener('click', () => {
    navHome.classList.add('active');
    navSearch.classList.remove('active');
    searchContainer.style.display = 'none';
    heroTitle.innerText = 'Good evening';
    
    // Show all songs
    songCards.forEach(card => card.style.display = 'block');
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    songCards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const artist = card.querySelector('p').innerText.toLowerCase();
        if (title.includes(query) || artist.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Click on card to play
songCards.forEach(card => {
    card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-index'));
        currentSongIndex = index;
        loadSong(currentSongIndex);
        if (!isPlaying) togglePlay();
        else audio.play();
    });
});

// Auto next
audio.addEventListener('ended', () => {
    nextBtn.click();
});

// Initialize
loadSong(currentSongIndex);
