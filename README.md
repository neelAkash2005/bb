# 💫 Romantic Surprise Webpage

A beautiful, responsive HTML/CSS/JavaScript webpage for delivering a romantic surprise with animations, interactive elements, and customizable messages.

## ✨ Features

### Design & UI
- **Soft Pastel Theme**: Light lavender, peach, and sky blue gradient background
- **Cute Animated Character**: Interactive bunny with blinking eyes, twitching ears, and wiggling nose
- **Smooth Animations**: Fade-in, bounce, and scaling effects
- **Floating Background Elements**: Animated hearts, stars, and bubbles slowly floating down
- **Mobile Responsive**: Fully optimized for all screen sizes (desktop, tablet, mobile)

### Interactive Elements
- **"Tell me" Button**: Reveals the special message with a typewriter effect
- **"Maybe later" Button**: Playfully moves away when clicked (after 2-3 attempts shows a funny message)
- **Modal Message Screen**: Displays customized message with elegant styling
- **Birthday Screen**: Final screen with celebration confetti animation
- **Confetti Animation**: Colorful particles burst across the screen
- **Floating Hearts**: Hearts rise up gracefully during message reveal

### Audio
- **Background Music**: Optional soft music (toggle with 🔊 button)
- **Music Control**: Mute/unmute button in bottom-right corner

## 📁 Files Structure

```
bb/
├── index.html      # HTML structure
├── style.css       # All styling and animations
├── script.js       # Interactive functionality
└── README.md       # This file
```

## 🚀 How to Use

### 1. Open in Browser
Simply open `index.html` in any modern web browser:
- Chrome
- Firefox
- Safari
- Edge

### 2. File Path
```
c:\Users\Akash\Desktop\bb\index.html
```

### 3. Customizing Messages

Edit the `config` object at the top of `script.js` to personalize the messages:

```javascript
const config = {
    mainMessage: `Your custom message here... 💕

You can include multiple lines
and emojis like ❤️ ✨ 💫`,

    birthdayMessage: `Your birthday message here! 🎂

Customize this with personal touches
and heartfelt wishes.`
};
```

## 🎨 Customization Guide

### Change Colors
In `style.css`, modify the gradient backgrounds:

```css
body {
    background: linear-gradient(135deg, #ffeef8 0%, #e8d5f2 50%, #cce5ff 100%);
}
```

### Change Button Colors
```css
.btn-primary {
    background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
}

.btn-secondary {
    background: linear-gradient(135deg, #6b9fd9 0%, #4a7ba7 100%);
}
```

### Replace the Bunny Character
The bunny is created with CSS in the `.bunny` class. You can either:
1. Use CSS to draw a different character (teddy, heart, etc.)
2. Replace with a simple emoji or SVG

### Change Background Music
In `index.html`, update the audio source:
```html
<audio id="backgroundMusic" loop>
    <source src="YOUR_MUSIC_URL" type="audio/mpeg">
</audio>
```

### Adjust Animation Speeds
In `script.js`, modify the `speed` parameter in typewriter effect:
```javascript
typewriterEffect(config.mainMessage, 30); // 30ms between characters
```

## 📱 Mobile Features

- Touch-friendly buttons
- Responsive text sizing
- Optimized character size
- Full-screen experience
- No scrollbars (smooth scroll prevented)

## 🎯 User Flow

1. **Start**: See the heading, cute bunny, and two buttons
2. **Click "Tell me"**: Transition to message screen with typewriter effect
3. **See Message**: Beautiful modal with customized message + floating hearts
4. **Click "Next"**: Confetti explodes! Birthday screen appears
5. **Final Screen**: Personalized birthday message with celebration theme

## 🎭 Fun Interactions

- **Bunny Animations**: 
  - Eyes blink automatically
  - Ears twitch randomly
  - Nose wiggles
  - Bunny bobs up and down

- **"Maybe later" Button**:
  - Moves to random position when clicked
  - After 2-3 attempts, shows humorous message
  - Playful user experience

- **Animations**:
  - Entrance fade-in + bounce
  - Modal pop-in effect
  - Confetti burst
  - Floating hearts
  - Floating background elements

## 🎵 Audio Note

The webpage includes a placeholder for background music. Some browsers prevent autoplay with sound:
- Users can click the 🔊 button to enable/disable music
- Music attempts to play on first user interaction

## 💡 Tips

- Test on different devices before sharing
- Customize the messages for a personal touch
- Add your own background music URL
- Adjust animation speeds for your preference
- Consider screen brightness for the best visual impact

## 🐛 Browser Compatibility

- Chrome: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported (iOS & macOS)
- Edge: ✅ Fully supported
- Internet Explorer: ❌ Not supported

## 📝 Notes

- All code uses vanilla JavaScript (no frameworks)
- No external dependencies required
- Fully responsive design
- Smooth animations and transitions
- Clean, well-structured code

## 🎁 Perfect For

- Birthdays
- Anniversaries
- Special occasions
- Romantic gestures
- Surprise messages
- Fun celebrations

---

Made with ❤️ for special moments! 💫
