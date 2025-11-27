// Learn to Read - JavaScript functionality

class WordCardApp {
    constructor() {
        this.currentIndex = 0;
        this.words = [
            'LAPĖ',
            'GĖLĖ',
            'BITĖ',
            'KATĖ',
            'MAMA',
            'VAZA',
            'SAGA',
            'LOVA',
            'TĖTĖ',
            'MĖTA',
            'MATAS',
            'PELĖ',
            'KOJA',
            'KĖDĖ',
            'BĖGA',
            'KOŠĖ',
            'KAVA',
            'ŠAKA',
            'SĖDI',
            'GULI'
        ];
        
        this.audioContext = null;
        this.speechSynthesis = window.speechSynthesis;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateDots();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.wordDisplay = document.getElementById('wordDisplay');
        this.speakerBtn = document.getElementById('speakerBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsNavigation = document.getElementById('dotsNavigation');
        this.wordCard = document.getElementById('wordCard');
        
        // Touch/swipe variables
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
    }
    
    setupEventListeners() {
        // Speaker button
        this.speakerBtn.addEventListener('click', () => this.speakWord());
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousWord());
        this.nextBtn.addEventListener('click', () => this.nextWord());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousWord();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextWord();
                    break;
                case ' ':
                    e.preventDefault();
                    this.speakWord();
                    break;
            }
        });
        
        // Touch/swipe events
        this.wordCard.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.wordCard.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for desktop swipe simulation
        this.wordCard.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.wordCard.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.wordCard.addEventListener('mouseleave', () => this.handleMouseLeave());
    }
    
    generateDots() {
        this.dotsNavigation.innerHTML = '';
        this.dots = [];
        
        for (let i = 0; i < this.words.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => this.goToWord(i));
            this.dotsNavigation.appendChild(dot);
            this.dots.push(dot);
        }
    }
    
    updateDisplay() {
        // Update word display with formatting
        const word = this.words[this.currentIndex];
        const formattedWord = this.formatWord(word);
        this.wordDisplay.textContent = formattedWord;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Always enable navigation buttons for circular navigation
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
        
        // Update button styles
        this.prevBtn.classList.toggle('btn-outline-secondary', this.currentIndex === 0);
        this.prevBtn.classList.toggle('btn-outline-primary', this.currentIndex !== 0);
        this.nextBtn.classList.toggle('btn-outline-secondary', this.currentIndex === this.words.length - 1);
        this.nextBtn.classList.toggle('btn-outline-primary', this.currentIndex !== this.words.length - 1);
    }
    
    formatWord(word) {
        let formatted = '';
        for (let i = 0; i < word.length; i++) {
            formatted += word[i];
            if (i === 1 && i < word.length - 1) {
                formatted += '      '; // Six spaces only after first two letters
            }
        }
        return formatted;
    }
    
    speakWord() {
        const word = this.words[this.currentIndex];
        
        // Add visual feedback
        this.speakerBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.speakerBtn.style.transform = 'scale(1)';
        }, 100);
        
        // Use Web Speech API
        if (this.speechSynthesis && this.speechSynthesis.speak) {
            // Cancel any ongoing speech
            this.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'lt-LT'; // Lithuanian
            utterance.rate = 0.8; // Slightly slower for clarity
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            this.speechSynthesis.speak(utterance);
        } else {
            // Fallback: alert the word (for testing)
            alert(`Pronunciation: ${word}`);
        }
    }
    
    previousWord() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateDisplay();
            this.addSwipeAnimation('right');
        } else {
            // Jump to last word if at the first word
            this.currentIndex = this.words.length - 1;
            this.updateDisplay();
            this.addSwipeAnimation('right');
        }
    }
    
    nextWord() {
        if (this.currentIndex < this.words.length - 1) {
            this.currentIndex++;
            this.updateDisplay();
            this.addSwipeAnimation('left');
        } else {
            // Jump to first word if at the last word
            this.currentIndex = 0;
            this.updateDisplay();
            this.addSwipeAnimation('left');
        }
    }
    
    goToWord(index) {
        if (index >= 0 && index < this.words.length && index !== this.currentIndex) {
            const direction = index > this.currentIndex ? 'left' : 'right';
            this.currentIndex = index;
            this.updateDisplay();
            this.addSwipeAnimation(direction);
        }
    }
    
    addSwipeAnimation(direction) {
        this.wordCard.classList.add(`swipe-${direction}`);
        setTimeout(() => {
            this.wordCard.classList.remove(`swipe-${direction}`);
        }, 300);
    }
    
    // Touch/swipe handling
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe();
    }
    
    // Mouse handling for desktop
    handleMouseDown(e) {
        this.touchStartX = e.screenX;
        this.touchStartY = e.screenY;
        this.isMouseDown = true;
    }
    
    handleMouseUp(e) {
        if (this.isMouseDown) {
            this.touchEndX = e.screenX;
            this.touchEndY = e.screenY;
            this.handleSwipe();
            this.isMouseDown = false;
        }
    }
    
    handleMouseLeave() {
        this.isMouseDown = false;
    }
    
    handleSwipe() {
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;
        
        // Minimum swipe distance
        const minSwipeDistance = 50;
        
        // Check if it's a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe left - next word
                this.nextWord();
            } else {
                // Swipe right - previous word
                this.previousWord();
            }
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WordCardApp();
}); 
