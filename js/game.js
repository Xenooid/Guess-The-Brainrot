/* ================================================================
   CHARACTER GUESSER - GAME LOGIC
   
   Core game mechanics:
   - Question management and randomization
   - Game state tracking
   - Answer validation
   - Score calculation
   - Screen transitions
   
   This file handles all game logic and is separated from the
   question database (questions.js) for easy content management.
   ================================================================ */

// ================================================================
// 1. GAME STATE MANAGEMENT
// ================================================================

class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.gameActive = false;
        this.selectedAnswerIndex = null;
        this.questionAnswered = false;
        this.selectedQuestions = [];
    }

    incrementScore() {
        this.score++;
    }

    incrementStreak() {
        this.streak++;
        if (this.streak > this.bestStreak) {
            this.bestStreak = this.streak;
        }
    }

    resetStreak() {
        this.streak = 0;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.selectedAnswerIndex = null;
        this.questionAnswered = false;
    }

    isGameComplete() {
        return this.currentQuestionIndex >= this.selectedQuestions.length;
    }

    getPercentage() {
        if (this.selectedQuestions.length === 0) return 0;
        return Math.round((this.score / this.selectedQuestions.length) * 100);
    }
}

// ================================================================
// 2. QUESTION MANAGEMENT
// ================================================================

class QuestionManager {
    constructor() {
        this.allQuestions = questions || [];
        this.wrongAnswers = wrongAnswerPool || [];
    }

    /**
     * Generate random options for a question using wrongAnswerPool
     * @param {object} question - The question object with correctAnswer
     * @returns {array} Array of 4 shuffled options (correct + 3 random wrong)
     */
    generateRandomOptions(question) {
        const correctAnswer = question.correctAnswer;
        
        // Get unique wrong answers that aren't the correct answer
        const uniqueWrongAnswers = [...new Set(this.wrongAnswers)].filter(
            answer => answer !== correctAnswer
        );
        
        // Pick 3 unique random wrong answers
        const shuffledWrong = [...uniqueWrongAnswers].sort(() => Math.random() - 0.5);
        const selectedWrong = shuffledWrong.slice(0, 3);
        
        // Combine correct answer with wrong ones and ensure all are unique
        const allOptions = [...new Set([correctAnswer, ...selectedWrong])];
        
        // In case we have less than 4 options (edge case), add dummy options
        while (allOptions.length < 4) {
            allOptions.push(`Option ${allOptions.length + 1}`);
        }
        
        // Shuffle and return
        return this.shuffleOptions(allOptions.slice(0, 4));
    }

    /**
     * Get a random subset of questions from the full database
     * @param {number} count - Number of questions to select (default: 20)
     * @returns {array} Array of randomly selected and shuffled questions
     */
    getRandomQuestions(count = 20) {
        if (this.allQuestions.length === 0) {
            console.error('No questions found in database');
            return [];
        }

        // Ensure we don't try to get more questions than available
        const selectionCount = Math.min(count, this.allQuestions.length);

        // Shuffle using Fisher-Yates algorithm
        const shuffled = [...this.allQuestions].sort(() => Math.random() - 0.5);

        // Return the first `count` questions
        return shuffled.slice(0, selectionCount);
    }

    /**
     * Shuffle answer options for a question
     * @param {array} options - Array of answer options
     * @returns {array} Shuffled array of options
     */
    shuffleOptions(options) {
        return [...options].sort(() => Math.random() - 0.5);
    }

    /**
     * Find the correct answer in shuffled options
     * @param {string} correctAnswer - The correct answer
     * @param {array} shuffledOptions - The shuffled options
     * @returns {number} Index of correct answer in shuffled array
     */
    findCorrectAnswerIndex(correctAnswer, shuffledOptions) {
        return shuffledOptions.findIndex(option => option === correctAnswer);
    }
}

// ================================================================
// 3. GAME CONTROLLER
// ================================================================

class GameController {
    constructor() {
        this.gameState = new GameState();
        this.questionManager = new QuestionManager();
        this.currentShuffledOptions = [];
        this.correctAnswerIndex = -1;

        // DOM Elements
        this.screens = {
            start: document.getElementById('startScreen'),
            game: document.getElementById('gameScreen'),
            results: document.getElementById('resultsScreen')
        };

        this.elements = {
            startBtn: document.getElementById('startBtn'),
            playAgainBtn: document.getElementById('playAgainBtn'),
            homeBtn: document.getElementById('homeBtn'),
            characterImage: document.getElementById('characterImage'),
            optionsContainer: document.getElementById('optionsContainer'),
            feedbackMessage: document.getElementById('feedbackMessage'),
            currentScore: document.getElementById('currentScore'),
            streak: document.getElementById('streak'),
            questionProgress: document.getElementById('questionProgress'),
            progressFill: document.getElementById('progressFill'),
            finalScore: document.getElementById('finalScore'),
            percentageScore: document.getElementById('percentageScore'),
            bestStreak: document.getElementById('bestStreak'),
            resultIcon: document.getElementById('resultIcon'),
            resultTitle: document.getElementById('resultTitle'),
            performanceText: document.getElementById('performanceText'),
            imageError: document.getElementById('imageError')
        };

        this.attachEventListeners();
        this.preloadImages();
    }

    /**
     * Attach event listeners to buttons
     */
    attachEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.playAgainBtn.addEventListener('click', () => this.startGame());
        this.elements.homeBtn.addEventListener('click', () => this.goHome());
    }

    /**
     * Preload all question images to reduce loading delays
     */
    preloadImages() {
        if (!this.questionManager.allQuestions) return;

        this.questionManager.allQuestions.forEach(question => {
            const img = new Image();
            img.src = question.image;
            img.onerror = () => {
                // Log missing images but don't break the game
                console.warn(`Failed to load image: ${question.image}`);
            };
        });
    }

    /**
     * Initialize and start a new game
     */
    startGame() {
        this.gameState.reset();
        this.gameState.selectedQuestions = this.questionManager.getRandomQuestions(20);

        if (this.gameState.selectedQuestions.length === 0) {
            alert('No questions available. Please check your questions.js file.');
            return;
        }

        this.gameState.gameActive = true;
        this.switchScreen('game');
        this.loadQuestion();
    }

    /**
     * Load and display the current question
     */
    loadQuestion() {
        if (this.gameState.isGameComplete()) {
            this.endGame();
            return;
        }

        const question = this.gameState.selectedQuestions[this.gameState.currentQuestionIndex];

        // Load character image
        this.elements.characterImage.src = question.image;
        this.elements.characterImage.style.display = 'block';
        this.elements.imageError.style.display = 'none';

        // Generate random options (or use existing options if available)
        if (question.options && question.options.length > 0) {
            this.currentShuffledOptions = this.questionManager.shuffleOptions(question.options);
        } else {
            this.currentShuffledOptions = this.questionManager.generateRandomOptions(question);
        }
        
        this.correctAnswerIndex = this.questionManager.findCorrectAnswerIndex(
            question.correctAnswer,
            this.currentShuffledOptions
        );

        // Render answer buttons
        this.renderOptions();

        // Update progress indicators
        this.updateProgress();
    }

    /**
     * Render answer option buttons
     */
    renderOptions() {
        this.elements.optionsContainer.innerHTML = '';
        this.elements.feedbackMessage.style.display = 'none';

        this.currentShuffledOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.dataset.index = index;
            button.disabled = false;

            button.addEventListener('click', () => this.handleAnswerSelection(index));

            this.elements.optionsContainer.appendChild(button);
        });
    }

    /**
     * Handle user's answer selection
     * @param {number} selectedIndex - Index of selected answer
     */
    handleAnswerSelection(selectedIndex) {
        // Prevent multiple selections for the same question
        if (this.gameState.questionAnswered) {
            return;
        }

        this.gameState.questionAnswered = true;
        this.gameState.selectedAnswerIndex = selectedIndex;

        const isCorrect = selectedIndex === this.correctAnswerIndex;

        // Disable all buttons
        const buttons = this.elements.optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);

        // Highlight correct and incorrect answers
        buttons[this.correctAnswerIndex].classList.add('correct');
        if (!isCorrect) {
            buttons[selectedIndex].classList.add('incorrect');
        }

        // Show feedback message
        this.showFeedback(isCorrect);

        // Update score and streak
        if (isCorrect) {
            this.gameState.incrementScore();
            this.gameState.incrementStreak();
        } else {
            this.gameState.resetStreak();
        }

        this.updateScore();

        // Proceed to next question after delay
        setTimeout(() => this.proceedToNextQuestion(), 1500);
    }

    /**
     * Display feedback message
     * @param {boolean} isCorrect - Whether the answer was correct
     */
    showFeedback(isCorrect) {
        const messages = {
            correct: [
                '✓ Correct! Amazing knowledge!',
                '✓ You got it! Well done!',
                '✓ Excellent! That\'s right!',
                '✓ Perfect! You nailed it!',
                '✓ Fantastic! Correct answer!'
            ],
            incorrect: [
                '✗ Incorrect. Better luck next time!',
                '✗ Not quite. Keep learning!',
                '✗ Wrong answer. Try the next one!',
                '✗ Oops! That wasn\'t it.',
                '✗ Incorrect. You\'ll get the next one!'
            ]
        };

        const messageArray = isCorrect ? messages.correct : messages.incorrect;
        const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];

        this.elements.feedbackMessage.textContent = randomMessage;
        this.elements.feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
        this.elements.feedbackMessage.style.display = 'block';
    }

    /**
     * Move to the next question
     */
    proceedToNextQuestion() {
        this.gameState.nextQuestion();
        this.loadQuestion();
    }

    /**
     * Update progress indicators (score, progress bar, question count)
     */
    updateProgress() {
        const currentQuestion = this.gameState.currentQuestionIndex + 1;
        const totalQuestions = this.gameState.selectedQuestions.length;
        const progressPercentage = (currentQuestion / totalQuestions) * 100;

        this.elements.questionProgress.textContent = `${currentQuestion}/${totalQuestions}`;
        this.elements.progressFill.style.width = `${progressPercentage}%`;
    }

    /**
     * Update and display current score
     */
    updateScore() {
        this.elements.currentScore.textContent = this.gameState.score;
        this.elements.streak.textContent = this.gameState.streak;
    }

    /**
     * End the game and show results
     */
    endGame() {
        this.gameState.gameActive = false;
        this.displayResults();
        this.switchScreen('results');
    }

    /**
     * Display game results
     */
    displayResults() {
        const score = this.gameState.score;
        const total = this.gameState.selectedQuestions.length;
        const percentage = this.gameState.getPercentage();
        const bestStreak = this.gameState.bestStreak;

        // Update score display
        this.elements.finalScore.textContent = score;
        this.elements.percentageScore.textContent = `${percentage}%`;
        this.elements.bestStreak.textContent = bestStreak;

        // Determine result title and icon based on percentage
        const resultData = this.getResultData(percentage);
        this.elements.resultIcon.textContent = resultData.icon;
        this.elements.resultTitle.textContent = resultData.title;
        this.elements.performanceText.innerHTML = resultData.message;
    }

    /**
     * Get result title, icon, and message based on score percentage
     * @param {number} percentage - Score percentage
     * @returns {object} Result data object
     */
    getResultData(percentage) {
        if (percentage === 100) {
            return {
                icon: '🏆',
                title: 'PERFECT SCORE!',
                message: '<strong>Outstanding!</strong> You are a true character expert! ' +
                         'You demonstrated masterful knowledge across all questions. 🎉'
            };
        } else if (percentage >= 90) {
            return {
                icon: '🥇',
                title: 'Excellent!',
                message: '<strong>Exceptional performance!</strong> You scored in the elite tier. ' +
                         'Your character knowledge is impressive! 🌟'
            };
        } else if (percentage >= 80) {
            return {
                icon: '🥈',
                title: 'Very Good!',
                message: '<strong>Great job!</strong> You demonstrated strong character knowledge. ' +
                         'Keep practicing to reach the top! 💪'
            };
        } else if (percentage >= 70) {
            return {
                icon: '🥉',
                title: 'Good Work!',
                message: '<strong>Nice effort!</strong> You got most of the questions right. ' +
                         'Keep watching and improve your score! 📈'
            };
        } else if (percentage >= 50) {
            return {
                icon: '📚',
                title: 'Keep Learning!',
                message: '<strong>Good start!</strong> You got half of the questions right. ' +
                         'Study up and try again—you\'ll do better next time! 🚀'
            };
        } else {
            return {
                icon: '🎓',
                title: 'Better Luck Next Time!',
                message: '<strong>Don\'t worry!</strong> Character knowledge takes time to build. ' +
                         'Play again and learn more! 🌈'
            };
        }
    }

    /**
     * Switch between game screens
     * @param {string} screenName - Name of screen to show ('start', 'game', or 'results')
     */
    switchScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('screen-active');
        });

        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('screen-active');
        }
    }

    /**
     * Go back to start screen
     */
    goHome() {
        this.gameState.reset();
        this.switchScreen('start');
    }
}

// ================================================================
// 4. UTILITY FUNCTIONS
// ================================================================

/**
 * Handle image loading errors gracefully
 * @param {HTMLImageElement} imgElement - The image element that failed to load
 */
function handleImageError(imgElement) {
    imgElement.style.display = 'none';
    const errorElement = document.getElementById('imageError');
    if (errorElement) {
        errorElement.style.display = 'flex';
    }
}

// ================================================================
// 5. INITIALIZATION
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game when DOM is ready
    window.game = new GameController();

    // Show start screen initially
    window.game.switchScreen('start');

    // Optional: Log game info for debugging
    console.log(`Game initialized with ${window.game.questionManager.allQuestions.length} total questions available`);
});

// ================================================================
// 6. ERROR HANDLING
// ================================================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

if (!window.questions) {
    console.warn('Warning: questions.js not loaded. Game will not work without question data.');
}
