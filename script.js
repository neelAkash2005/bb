// Configuration - Customize these messages
const config = {
    mainMessage: `You mean the world to me! 💕

Every moment with you is special.
This is a small token of my affection,
reminding you how amazing you are.

I hope this brings a smile to your face
and warmth to your heart. 

You deserve all the happiness in the world!`,

    birthdayMessage: `Today is your special day! 🎂✨

Thank you for being the wonderful person you are.
Your kindness, warmth, and beautiful spirit
light up everyone's life around you.

I'm so grateful to celebrate you today.
May all your dreams come true!

Wishing you a year filled with love, 
laughter, and endless adventures together. 💕`
};

// Game State
let attemptCount = 0;
const MAX_ATTEMPTS = 2;
let friendNoAttempts = 0;
const MAX_FRIEND_ATTEMPTS = 3;
let musicPlaying = false;
const PRIMARY_TRACK_VOLUME = 1.0;
const SECONDARY_TRACK_VOLUME = 0.12;
const PRIMARY_TRACK_GAIN_BOOST = 1.35;
const PRIMARY_TRACK_TREBLE_BOOST_DB = 5;

let audioContext = null;
let primarySourceNode = null;
let primaryGainNode = null;
let primaryTrebleNode = null;
let usingEnhancedPrimaryAudio = false;

// DOM Elements
const mainScreen = document.getElementById('mainScreen');
const friendScreen = document.getElementById('friendScreen');
const birthdayScreen = document.getElementById('birthdayScreen');
const tellMeBtn = document.getElementById('tellMeBtn');
const maybeBtn = document.getElementById('maybeBtn');
const friendYesBtn = document.getElementById('friendYesBtn');
const friendNoBtn = document.getElementById('friendNoBtn');
const restartBtn = document.getElementById('restartBtn');
const catOverlay = document.getElementById('catOverlay');
const catCloseBtn = document.getElementById('catCloseBtn');
const friendEscapeMessage = document.getElementById('friendEscapeMessage');
const birthdayMessage = document.getElementById('birthdayMessage');
const escapeMessage = document.getElementById('escapeMessage');
const musicBtn = document.getElementById('musicBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const backgroundMusicSoft = document.getElementById('backgroundMusicSoft');
const confettiCanvas = document.getElementById('confetti');
const friendConfettiCanvas = document.getElementById('friendConfetti');
const floatingHeartsCanvas = document.getElementById('floatingHearts');

async function initializePrimaryAudioProcessing() {
    if (usingEnhancedPrimaryAudio || !backgroundMusic) {
        return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
        return;
    }

    try {
        audioContext = new AudioCtx();
        primarySourceNode = audioContext.createMediaElementSource(backgroundMusic);

        primaryGainNode = audioContext.createGain();
        primaryGainNode.gain.value = PRIMARY_TRACK_GAIN_BOOST;

        primaryTrebleNode = audioContext.createBiquadFilter();
        primaryTrebleNode.type = 'highshelf';
        primaryTrebleNode.frequency.value = 3200;
        primaryTrebleNode.gain.value = PRIMARY_TRACK_TREBLE_BOOST_DB;

        primarySourceNode.connect(primaryTrebleNode);
        primaryTrebleNode.connect(primaryGainNode);
        primaryGainNode.connect(audioContext.destination);

        usingEnhancedPrimaryAudio = true;
    } catch (error) {
        usingEnhancedPrimaryAudio = false;
        console.log('Primary audio enhancement unavailable:', error);
    }
}

// Set canvas sizes
function resizeCanvases() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    if (friendConfettiCanvas) {
        friendConfettiCanvas.width = window.innerWidth;
        friendConfettiCanvas.height = window.innerHeight;
    }
    floatingHeartsCanvas.width = window.innerWidth;
    floatingHeartsCanvas.height = window.innerHeight;
}

resizeCanvases();
window.addEventListener('resize', resizeCanvases);

// ===== Button Event Listeners =====
tellMeBtn.addEventListener('click', showMessage);
friendYesBtn.addEventListener('click', showBirthday);
friendNoBtn.addEventListener('click', moveFriendNoButton);
restartBtn.addEventListener('click', restart);
musicBtn.addEventListener('click', toggleMusic);

// "Maybe later" button shows cat popup for now
maybeBtn.addEventListener('click', escapeButtonClick);
catCloseBtn.addEventListener('click', closeCatPopup);
catOverlay.addEventListener('click', (event) => {
    if (event.target === catOverlay) {
        closeCatPopup();
    }
});

function escapeButtonClick() {
    showCatPopup();
}

function showCatPopup() {
    catOverlay.classList.add('active');
    catOverlay.setAttribute('aria-hidden', 'false');
}

function closeCatPopup() {
    catOverlay.classList.remove('active');
    catOverlay.setAttribute('aria-hidden', 'true');
}

// ===== Screen Navigation =====
function showScreen(screen) {
    mainScreen.classList.remove('active');
    friendScreen.classList.remove('active');
    birthdayScreen.classList.remove('active');
    screen.classList.add('active');
}

function showMessage() {
    friendNoAttempts = 0;
    friendEscapeMessage.style.display = 'none';
    friendNoBtn.style.position = 'relative';
    friendNoBtn.style.left = '0';
    friendNoBtn.style.top = '0';
    closeCatPopup();
    showScreen(friendScreen);
    playCuteConfetti();
}

function backToMain() {
    attemptCount = 0;
    escapeMessage.style.display = 'none';
    closeCatPopup();
    showScreen(mainScreen);
}

function showBirthday() {
    showScreen(birthdayScreen);
    birthdayMessage.textContent = config.birthdayMessage;
    playConfetti();
}

function restart() {
    attemptCount = 0;
    friendNoAttempts = 0;
    escapeMessage.style.display = 'none';
    friendEscapeMessage.style.display = 'none';
    friendNoBtn.style.position = 'relative';
    friendNoBtn.style.left = '0';
    friendNoBtn.style.top = '0';
    birthdayMessage.textContent = '';
    closeCatPopup();
    showScreen(mainScreen);
}

function moveFriendNoButton() {
    friendNoAttempts++;

    if (friendNoAttempts >= MAX_FRIEND_ATTEMPTS) {
        friendEscapeMessage.style.display = 'block';
        friendEscapeMessage.textContent = "Don't run away 😄 just click the other one!";
        return;
    }

    const randomX = Math.random() * (window.innerWidth - 150);
    const randomY = Math.random() * (window.innerHeight * 0.7);

    friendNoBtn.style.position = 'fixed';
    friendNoBtn.style.left = randomX + 'px';
    friendNoBtn.style.top = randomY + 'px';
    friendNoBtn.style.transition = 'all 0.3s ease';

    setTimeout(() => {
        friendNoBtn.style.position = 'relative';
        friendNoBtn.style.left = '0';
        friendNoBtn.style.top = '0';
    }, 1000);
}

function playCuteConfetti() {
    if (!friendConfettiCanvas) {
        return;
    }

    const ctx = friendConfettiCanvas.getContext('2d');
    const particles = [];

    for (let i = 0; i < 70; i++) {
        particles.push({
            x: Math.random() * friendConfettiCanvas.width,
            y: Math.random() * friendConfettiCanvas.height - friendConfettiCanvas.height,
            size: Math.random() * 16 + 10,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 3 + 1.4,
            life: 1,
            decay: Math.random() * 0.01 + 0.008,
            symbol: '🐼',
            color: 'rgba(255, 255, 255, 0.98)'
        });
    }

    function animate() {
        ctx.clearRect(0, 0, friendConfettiCanvas.width, friendConfettiCanvas.height);
        let activeParticles = 0;

        particles.forEach((p) => {
            if (p.life > 0) {
                activeParticles++;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;

                ctx.save();
                ctx.globalAlpha = p.life;
                ctx.font = `${p.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = p.color;
                ctx.fillText(p.symbol, p.x, p.y);
                ctx.restore();

                p.life -= p.decay;
            }
        });

        if (activeParticles > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ===== Confetti Animation =====
function playConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    const particles = [];

    // Create confetti particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            vx: Math.random() * 6 - 3,
            vy: Math.random() * 10 + 5,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            color: ['#ff6b9d', '#c44569', '#6b9fd9', '#ffd700', '#ffb3d9'][
                Math.floor(Math.random() * 5)
            ],
            life: 1,
            decay: Math.random() * 0.015 + 0.015,
        });
    }

    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let activeParticles = 0;

        particles.forEach((p) => {
            if (p.life > 0) {
                activeParticles++;

                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // gravity
                p.rotation += p.rotationSpeed;

                // Draw particle
                ctx.save();
                ctx.globalAlpha = p.life;
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(
                    -p.width / 2,
                    -p.height / 2,
                    p.width,
                    p.height
                );
                ctx.restore();

                // Reduce life
                p.life -= p.decay;
            }
        });

        if (activeParticles > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ===== Floating Hearts Animation =====
function playFloatingHearts() {
    const ctx = floatingHeartsCanvas.getContext('2d');
    const hearts = [];

    // Create floating hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            hearts.push({
                x: Math.random() * floatingHeartsCanvas.width,
                y: floatingHeartsCanvas.height + 20,
                vy: Math.random() * 2 + 1,
                vx: Math.random() * 2 - 1,
                size: Math.random() * 20 + 15,
                life: 1,
                decay: Math.random() * 0.01 + 0.005,
            });
        }, i * 100);
    }

    function animate() {
        ctx.clearRect(
            0,
            0,
            floatingHeartsCanvas.width,
            floatingHeartsCanvas.height
        );
        let activeHearts = 0;

        hearts.forEach((h) => {
            if (h.life > 0) {
                activeHearts++;

                h.y -= h.vy;
                h.x += h.vx;

                ctx.save();
                ctx.globalAlpha = h.life;
                ctx.font = `${h.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('❤️', h.x, h.y);
                ctx.restore();

                h.life -= h.decay;
            }
        });

        if (activeHearts > 0 || hearts.length < 20) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ===== Music Control =====
function toggleMusic() {
    if (musicPlaying) {
        backgroundMusic.pause();
        if (backgroundMusicSoft) {
            backgroundMusicSoft.pause();
        }
        musicBtn.textContent = '🔇';
        musicBtn.classList.add('muted');
        musicPlaying = false;
    } else {
        const startPlayback = async () => {
            backgroundMusic.volume = PRIMARY_TRACK_VOLUME;

            await initializePrimaryAudioProcessing();
            if (audioContext && audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            if (backgroundMusicSoft) {
                backgroundMusicSoft.volume = SECONDARY_TRACK_VOLUME;
                backgroundMusicSoft.currentTime = backgroundMusic.currentTime;
            }

            await Promise.all([
                backgroundMusic.play(),
                backgroundMusicSoft ? backgroundMusicSoft.play() : Promise.resolve()
            ]);

            musicBtn.textContent = '🔊';
            musicBtn.classList.remove('muted');
            musicPlaying = true;
        };

        startPlayback()
            .then(() => {
                musicBtn.textContent = '🔊';
                musicBtn.classList.remove('muted');
                musicPlaying = true;
            })
            .catch((error) => {
                console.log('Play error:', error);
            });
    }
}

// Keep secondary track roughly synced with primary.
backgroundMusic.addEventListener('timeupdate', () => {
    if (!backgroundMusicSoft || backgroundMusicSoft.paused) {
        return;
    }

    const drift = Math.abs(backgroundMusic.currentTime - backgroundMusicSoft.currentTime);
    if (drift > 0.35) {
        backgroundMusicSoft.currentTime = backgroundMusic.currentTime;
    }
});



// ===== Initialization =====
window.addEventListener('load', () => {
    // Initialize with main screen
    showScreen(mainScreen);
    closeCatPopup();
    friendNoAttempts = 0;
    friendEscapeMessage.style.display = 'none';

    // Set initial button state
    musicBtn.textContent = '🔇';
    musicBtn.classList.add('muted');
    musicPlaying = false;

    // Default mix: primary track louder, secondary softer.
    backgroundMusic.volume = PRIMARY_TRACK_VOLUME;
    if (backgroundMusicSoft) {
        backgroundMusicSoft.volume = SECONDARY_TRACK_VOLUME;
    }

    initializePrimaryAudioProcessing();
});

// ===== Prevent Scrolling (for better UX) =====
document.addEventListener('wheel', (e) => {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });
