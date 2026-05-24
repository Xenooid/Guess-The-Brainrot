# Guess The Brainrot
A modern character guessing game built with vanilla HTML, CSS, and JavaScript! Guess characters from popular media!

## 🚀 How to Run
1. Download or clone the repo
2. Open `index.html` in your browser, or run a local server like `python -m http.server 8000`
3. Click "Start Game" and play!

## 📸 Where to Put Pictures
Put your character images in the `assets/images/` folder.

## ✏️ Adding Questions
Add questions in `js/questions.js` using this format:
```javascript
{
    image: "assets/images/your-image.jpg",
    correctAnswer: "Your Character Name"
}
```

## 🎲 Wrong Answer Pool
Add all your random wrong answers in `js/wrong-answers.js`! The game will automatically pick 3 random wrong answers for each question.

## 🛠️ Features
- 20 random questions per game
- Multiple choice with 4 options
- Score and streak tracking
- Responsive design
- No duplicate answers

## 📁 Project Structure
```
Guess-The-Brainrot/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # Styling
├── js/
│   ├── game.js             # Game logic
│   ├── questions.js        # Question database
│   └── wrong-answers.js    # Wrong answer pool
├── assets/
│   └── images/             # Character images
└── README.md               # This file
```
