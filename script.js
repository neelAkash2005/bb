// Configuration - Customize these messages
const config = {
    mainMessage: `You mean the world to me! 💕

Every moment with you is special.
This is a small token of my affection,
reminding you how amazing you are.

I hope this brings a smile to your face
and warmth to your heart. 

You deserve all the happiness in the world!`,

    birthdayMessage: `✨ Today is your day… a little universe of your own ✨

You came into my life like a quiet surprise,
unexpected… yet unbelievably beautiful. 💫

And somehow, you stayed—
in the small moments, in the silence, in the storms—
even when I couldn’t always stay the same for you. 🤍

You’ve been my quiet strength,
the smile behind my hardest days,
the warmth that never asked for anything in return. 🌸

You lifted me without making it loud,
loved me without making it heavy,
and raised my world to something softer, kinder, better. ✨

Today, I hope happiness finds you
in the gentlest ways possible—
like sunlight through a window,
like a song you didn’t know you needed. 🎶

May life give you endless reasons to smile,
and may you always remain
as strong, as independent, as caring,
and as beautifully you… 🌷

Happy Birthday 🎂
Take all my love, always… ❤️✨`
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
let autoMusicStarted = false;

// DOM Elements
const mainScreen = document.getElementById('mainScreen');
const friendScreen = document.getElementById('friendScreen');
const birthdayScreen = document.getElementById('birthdayScreen');
const memoriesScreen = document.getElementById('memoriesScreen');
const tellMeBtn = document.getElementById('tellMeBtn');
const maybeBtn = document.getElementById('maybeBtn');
const friendYesBtn = document.getElementById('friendYesBtn');
const friendNoBtn = document.getElementById('friendNoBtn');
const restartBtn = document.getElementById('restartBtn');
const catOverlay = document.getElementById('catOverlay');
const catCloseBtn = document.getElementById('catCloseBtn');
const friendEscapeMessage = document.getElementById('friendEscapeMessage');
const birthdayMessage = document.getElementById('birthdayMessage');
const birthdayMessageWrapper = document.querySelector('.birthday-message-wrapper');
const birthdayScrollHint = document.querySelector('.birthday-scroll-hint');
const memoriesFooter = document.querySelector('.memories-footer');
const memoriesActions = document.getElementById('memoriesActions');
const memoriesRepeatBtn = document.getElementById('memoriesRepeatBtn');
const memoriesCelebrateBtn = document.getElementById('memoriesCelebrateBtn');
const memoriesBalloons = document.getElementById('memoriesBalloons');
const memoriesPhoto = document.getElementById('memoriesPhoto');
const memoriesVideo = document.getElementById('memoriesVideo');
const memoriesPhotoCaption = document.getElementById('memoriesPhotoCaption');
const memoriesPhotoFrame = document.getElementById('memoriesPhotoFrame');
const memoriesBackBtn = document.getElementById('memoriesBackBtn');
const celebrateScreen = document.getElementById('celebrateScreen');
const celebrateBackBtn = document.getElementById('celebrateBackBtn');
const escapeMessage = document.getElementById('escapeMessage');
const musicBtn = document.getElementById('musicBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const backgroundMusicSoft = document.getElementById('backgroundMusicSoft');
const confettiCanvas = document.getElementById('confetti');
const friendConfettiCanvas = document.getElementById('friendConfetti');
const floatingHeartsCanvas = document.getElementById('floatingHearts');

function createMemoryImage(label, startColor, endColor) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 900" width="720" height="900">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${startColor}"/>
                    <stop offset="100%" stop-color="${endColor}"/>
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="22%" r="72%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.92"/>
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect width="720" height="900" rx="42" fill="url(#bg)"/>
            <rect width="720" height="900" rx="42" fill="url(#glow)"/>
            <circle cx="180" cy="190" r="86" fill="rgba(255,255,255,0.28)"/>
            <circle cx="558" cy="250" r="118" fill="rgba(255,255,255,0.18)"/>
            <path d="M136 694c72-82 162-122 240-122s164 40 208 104v88H136z" fill="rgba(255,255,255,0.18)"/>
            <text x="50%" y="52%" text-anchor="middle" fill="#7f1d4f" font-size="64" font-family="Segoe UI, Arial, sans-serif" font-weight="700">${label}</text>
            <text x="50%" y="60%" text-anchor="middle" fill="#8d2c55" font-size="30" font-family="Segoe UI, Arial, sans-serif">A sweet little memory</text>
            <text x="50%" y="82%" text-anchor="middle" fill="rgba(141,44,85,0.8)" font-size="26" font-family="Segoe UI, Arial, sans-serif">Tap another balloon for the next one</text>
        </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const memoryPhotos = [
    { label: 'Memory 1', caption: '✨ A smile that lights everything', image: '11.jpeg', type: 'image' },
    { label: 'Memory 2', caption: '🌸 Soft moments, strong soul', image: '22.jpeg', type: 'image' },
    { label: 'Memory 3', caption: '💫 Effortlessly beautiful', image: '33.jpeg', type: 'image' },
    { label: 'Memory 4', caption: '🤍 Where calm meets charm', image: '44.jpeg', type: 'image' },
    { label: 'Memory 5', caption: '🌷 Grace in every frame', image: '55.jpeg', type: 'image' },
    { label: 'Memory 6', caption: '🌼 Just being you is enough', image: '66.jpeg', type: 'image' },
    { label: 'Memory 7', caption: '🎀 A little magic in every glance', image: '77.jpeg', type: 'image' },
    { label: 'Memory 8', caption: '🌙 Quietly shining, always', image: '88.jpeg', type: 'image' },
    { label: 'Memory 9', caption: '❤️ My favorite kind of happiness', image: '99.jpeg', type: 'image' }
];

let memoryBalloonIndex = 0;
let memoryBalloonTimer = null;
let memorySpawnDelayTimer = null;
let memoryCycleVersion = 0;

function clearMemoryTimers() {
    clearTimeout(memoryBalloonTimer);
    clearTimeout(memorySpawnDelayTimer);
}

function hideMemoryActions() {
    if (memoriesActions) {
        memoriesActions.classList.add('is-hidden');
    }

    if (memoriesFooter) {
        memoriesFooter.textContent = 'Tap the balloons.';
    }
}

function showMemoryActions() {
    if (memoriesFooter) {
        memoriesFooter.textContent = 'All 9 memories completed!';
    }

    if (memoriesActions) {
        memoriesActions.classList.remove('is-hidden');
    }
}

function resetMemoryRun() {
    clearMemoryTimers();
    memoryBalloonIndex = 0;
    memoryCycleVersion += 1;
    hideMemoryActions();
}

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

async function startMainMusicPlayback() {
    if (!backgroundMusic) {
        return false;
    }

    backgroundMusic.volume = PRIMARY_TRACK_VOLUME;

    await initializePrimaryAudioProcessing();
    if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    await backgroundMusic.play();
    musicBtn.textContent = '🔊';
    musicBtn.classList.remove('muted');
    musicPlaying = true;
    return true;
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
restartBtn.addEventListener('click', openMemoriesPage);
if (memoriesBackBtn) {
    memoriesBackBtn.addEventListener('click', () => showScreen(birthdayScreen));
}
if (memoriesRepeatBtn) {
    memoriesRepeatBtn.addEventListener('click', () => {
        openMemoriesPage();
    });
}
if (memoriesCelebrateBtn) {
    memoriesCelebrateBtn.addEventListener('click', showCelebratePage);
}
if (celebrateBackBtn) {
    celebrateBackBtn.addEventListener('click', () => showScreen(memoriesScreen));
}
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
    if (memoriesScreen) {
        memoriesScreen.classList.remove('active');
    }
    if (celebrateScreen) {
        celebrateScreen.classList.remove('active');
    }
    screen.classList.add('active');
}

function showMemoryPhoto(index) {
    if (!memoriesPhotoCaption || !memoriesPhotoFrame) {
        return;
    }

    const photo = memoryPhotos[index % memoryPhotos.length];

    if (photo.type === 'video' && memoriesVideo) {
        if (memoriesPhoto) {
            memoriesPhoto.removeAttribute('src');
            memoriesPhoto.classList.remove('is-active');
            memoriesPhoto.style.opacity = '0';
            memoriesPhoto.style.display = 'none';
        }

        memoriesVideo.pause();
        memoriesPhotoFrame.classList.add('video-mode');
        memoriesVideo.playsInline = true;
        memoriesVideo.muted = true;
        memoriesVideo.loop = true;
        memoriesVideo.style.display = 'block';
        memoriesVideo.style.opacity = '1';
        memoriesVideo.setAttribute('controls', 'controls');
        memoriesVideo.classList.add('is-active');

        const startVideo = () => {
            try {
                memoriesVideo.currentTime = 0;
            } catch (error) {
                // Ignore seek failures before metadata is ready.
            }

            const playPromise = memoriesVideo.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
        };

        startVideo();

        if (memoriesVideo.readyState >= 2) {
            startVideo();
        } else {
            memoriesVideo.addEventListener('loadeddata', startVideo, { once: true });
            memoriesVideo.addEventListener('canplay', startVideo, { once: true });
            memoriesVideo.load();
        }
    } else if (memoriesPhoto) {
        if (memoriesVideo) {
            memoriesVideo.pause();
            memoriesVideo.classList.remove('is-active');
            memoriesVideo.style.opacity = '0';
            memoriesVideo.style.display = 'none';
        }

        memoriesPhotoFrame.classList.remove('video-mode');
        memoriesPhoto.alt = photo.caption;
        memoriesPhoto.src = photo.image;
        memoriesPhoto.style.display = 'block';
        memoriesPhoto.style.opacity = '1';
        memoriesPhoto.classList.add('is-active');
    }

    memoriesPhotoCaption.textContent = photo.caption;
    memoriesPhotoFrame.classList.add('has-photo');
}

function buildMemoryBalloons() {
    if (!memoriesBalloons) {
        return;
    }

    clearMemoryTimers();
    memoriesBalloons.innerHTML = '';

    const cycleVersion = ++memoryCycleVersion;
    memoryBalloonIndex = 0;
    hideMemoryActions();

    const spawnBalloon = (index) => {
        if (cycleVersion !== memoryCycleVersion) {
            return;
        }

        if (index >= memoryPhotos.length) {
            showMemoryActions();
            return;
        }

        const photo = memoryPhotos[index];
        const side = index % 2 === 0 ? 'left' : 'right';
        setTimeout(() => {
            if (cycleVersion !== memoryCycleVersion) {
                return;
            }

            const balloon = document.createElement('button');
            balloon.type = 'button';
            balloon.className = 'memory-balloon';
            balloon.setAttribute('aria-label', `Show ${photo.label}`);
            const sideOffset = 3 + Math.random() * 4;
            if (side === 'left') {
                balloon.style.left = `${sideOffset}vw`;
            } else {
                balloon.style.right = `${sideOffset}vw`;
            }
            balloon.style.setProperty('--balloon-drift', `${side === 'left' ? 34 + Math.random() * 18 : -(34 + Math.random() * 18)}px`);
            balloon.style.animationDuration = `${9 + Math.random() * 2.5}s, ${2.8 + Math.random() * 0.6}s`;
            balloon.style.animationDelay = `0s, ${Math.random() * 1.5}s`;
            balloon.addEventListener('click', () => {
                if (cycleVersion !== memoryCycleVersion) {
                    return;
                }

                showMemoryPhoto(index);
                balloon.classList.add('revealed');
                clearMemoryTimers();
                memoryBalloonTimer = setTimeout(() => {
                    if (cycleVersion !== memoryCycleVersion) {
                        return;
                    }

                    balloon.classList.add('bursting');
                    setTimeout(() => {
                        balloon.remove();
                        if (cycleVersion !== memoryCycleVersion) {
                            return;
                        }

                        const nextIndex = index + 1;
                        if (nextIndex >= memoryPhotos.length) {
                            showMemoryActions();
                            return;
                        }

                        memoryBalloonIndex = nextIndex;
                        memorySpawnDelayTimer = setTimeout(() => spawnBalloon(nextIndex), 140);
                    }, 320);
                }, 240);
            });

            memoriesBalloons.appendChild(balloon);
            memoryBalloonTimer = setTimeout(() => {
                if (cycleVersion !== memoryCycleVersion) {
                    return;
                }

                balloon.classList.add('bursting');
                setTimeout(() => {
                    balloon.remove();
                    if (cycleVersion !== memoryCycleVersion) {
                        return;
                    }

                    memorySpawnDelayTimer = setTimeout(() => spawnBalloon(index), 260);
                }, 320);
            }, 11000);
        }, 0);
    };

    spawnBalloon(0);
}

function updateBirthdayScrollHint() {
    if (!birthdayMessageWrapper || !birthdayScrollHint) {
        return;
    }

    const needsScroll = birthdayMessageWrapper.scrollHeight > birthdayMessageWrapper.clientHeight + 1;
    const reachedBottom = birthdayMessageWrapper.scrollTop + birthdayMessageWrapper.clientHeight >= birthdayMessageWrapper.scrollHeight - 8;

    if (!needsScroll || reachedBottom) {
        birthdayScrollHint.classList.add('is-hidden');
    } else {
        birthdayScrollHint.classList.remove('is-hidden');
    }
}

function showMessage() {
    friendNoAttempts = 0;
    friendEscapeMessage.style.display = 'none';
    friendNoBtn.style.position = 'relative';
    friendNoBtn.style.left = '0';
    friendNoBtn.style.top = '0';
    closeCatPopup();
    showScreen(friendScreen);
    startMainMusicPlayback().catch(() => {});
    playCuteConfetti();
}

function backToMain() {
    attemptCount = 0;
    escapeMessage.style.display = 'none';
    closeCatPopup();
    showScreen(mainScreen);
    startMainMusicPlayback().catch(() => {});
}

function showBirthday() {
    showScreen(birthdayScreen);
    birthdayMessage.textContent = config.birthdayMessage;
    if (birthdayMessageWrapper) {
        birthdayMessageWrapper.scrollTop = 0;
    }
    updateBirthdayScrollHint();
    startMainMusicPlayback().catch(() => {});
    playConfetti();
}

function openMemoriesPage() {
    showScreen(memoriesScreen);
    resetMemoryRun();
    startMainMusicPlayback().catch(() => {});
    if (memoriesBalloons) {
        memoriesBalloons.innerHTML = '';
    }

    buildMemoryBalloons();

    if (memoriesPhotoFrame) {
        memoriesPhotoFrame.classList.remove('has-photo');
        memoriesPhotoFrame.classList.remove('video-mode');
    }

    if (memoriesPhoto) {
        memoriesPhoto.removeAttribute('src');
        memoriesPhoto.alt = 'Selected memory';
        memoriesPhoto.classList.remove('is-active');
        memoriesPhoto.style.opacity = '0';
        memoriesPhoto.style.display = 'none';
    }

    if (memoriesVideo) {
        memoriesVideo.pause();
        memoriesVideo.classList.remove('is-active');
        memoriesVideo.style.opacity = '0';
        memoriesVideo.style.display = 'none';
    }

    if (memoriesPhotoCaption) {
        memoriesPhotoCaption.textContent = 'Tap a balloon to reveal a photo';
    }
}

function showCelebratePage() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
    window.location.href = 'celebrate.html';
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
    if (birthdayMessageWrapper) {
        birthdayMessageWrapper.scrollTop = 0;
    }
    if (birthdayScrollHint) {
        birthdayScrollHint.classList.remove('is-hidden');
    }
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
        startMainMusicPlayback()
            .then(() => {
                if (backgroundMusicSoft) {
                    backgroundMusicSoft.volume = SECONDARY_TRACK_VOLUME;
                    backgroundMusicSoft.currentTime = backgroundMusic.currentTime;
                    backgroundMusicSoft.play().catch(() => {});
                }
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

    startMainMusicPlayback()
        .then(() => {
            autoMusicStarted = true;
            if (backgroundMusicSoft) {
                backgroundMusicSoft.volume = SECONDARY_TRACK_VOLUME;
                backgroundMusicSoft.currentTime = backgroundMusic.currentTime;
                backgroundMusicSoft.play().catch(() => {});
            }
        })
        .catch(() => {});

    const unlockAutoMusic = () => {
        if (autoMusicStarted || musicPlaying) {
            return;
        }

        startMainMusicPlayback()
            .then(() => {
                autoMusicStarted = true;
                if (backgroundMusicSoft) {
                    backgroundMusicSoft.volume = SECONDARY_TRACK_VOLUME;
                    backgroundMusicSoft.currentTime = backgroundMusic.currentTime;
                    backgroundMusicSoft.play().catch(() => {});
                }
            })
            .catch(() => {});

        window.removeEventListener('pointerdown', unlockAutoMusic);
        window.removeEventListener('keydown', unlockAutoMusic);
        window.removeEventListener('touchstart', unlockAutoMusic);
    };

    window.addEventListener('pointerdown', unlockAutoMusic, { once: true });
    window.addEventListener('keydown', unlockAutoMusic, { once: true });
    window.addEventListener('touchstart', unlockAutoMusic, { once: true });
});

if (birthdayMessageWrapper) {
    birthdayMessageWrapper.addEventListener('scroll', updateBirthdayScrollHint);
}

window.addEventListener('resize', updateBirthdayScrollHint);

function isInsideBirthdayScrollArea(target) {
    return Boolean(target && (target.closest('.birthday-content') || target.closest('.birthday-message-wrapper')));
}

// ===== Prevent Scrolling (for better UX) =====
document.addEventListener('wheel', (e) => {
    if (!isInsideBirthdayScrollArea(e.target)) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isInsideBirthdayScrollArea(e.target)) {
        e.preventDefault();
    }
}, { passive: false });
