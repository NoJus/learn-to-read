class WordCardApp {
    constructor() {
        // Configuration Constants
        this.CONFIG = {
            SWIPE_THRESHOLD: 50,      // Minimum pixels to count as a swipe
            ANIMATION_DURATION: 300,  // ms
            SPEECH_RATE: 0.8,         // 0.1 to 10
            SPEECH_LANG_TARGET: 'lt', // Looking for language code containing 'lt'
            SPACER: '      '          // The visual space between syllables
        };

        this.currentIndex = 0;
        
        // REFACTOR: Data Structure
        // Storing 'text' (for audio/accessibility) and 'display' (for visuals) separately.
        // This allows you to handle 3-syllable words or irregular splits easily in the future.
        this.words = [
            { text: 'LAPĖ', display: `LA${this.CONFIG.SPACER}PĖ` },
            { text: 'GĖLĖ', display: `GĖ${this.CONFIG.SPACER}LĖ` },
            { text: 'BITĖ', display: `BI${this.CONFIG.SPACER}TĖ` },
            { text: 'KATĖ', display: `KA${this.CONFIG.SPACER}TĖ` },
            { text: 'MAMA', display: `MA${this.CONFIG.SPACER}MA` },
            { text: 'VAZA', display: `VA${this.CONFIG.SPACER}ZA` },
            { text: 'SAGA', display: `SA${this.CONFIG.SPACER}GA` },
            { text: 'LOVA', display: `LO${this.CONFIG.SPACER}VA` },
            { text: 'TĖTĖ', display: `TĖ${this.CONFIG.SPACER}TĖ` },
            { text: 'MĖTA', display: `MĖ${this.CONFIG.SPACER}TA` },
            { text: 'MATAS', display: `MA${this.CONFIG.SPACER}TAS` },
            { text: 'PELĖ', display: `PE${this.CONFIG.SPACER}LĖ` },
            { text: 'KOJA', display: `KO${this.CONFIG.SPACER}JA` },
            { text: 'KĖDĖ', display: `KĖ${this.CONFIG.SPACER}DĖ` },
            { text: 'BĖGA', display: `BĖ${this.CONFIG.SPACER}GA` },
            { text: 'KOŠĖ', display: `KO${this.CONFIG.SPACER}ŠĖ` },
            { text: 'KAVA', display: `KA${this.CONFIG.SPACER}VA` },
            { text: 'ŠAKA', display: `ŠE${this.CONFIG.SPACER}KA` },
            { text: 'SĖDI', display: `SĖ${this.CONFIG.SPACER}DI` },
            { text: 'GULI', display: `GU${this.CONFIG.SPACER}LI` }
        ];

        this.speechSynthesis = window.speechSynthesis;
        this.selectedVoice = null;
        
        this.initializeElements();
        this.initSpeech(); // Initialize voice loading
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
        
        // Unified Pointer state
        this.startX = 0;
        this.startY = 0;
    }

    // REFACTOR: Robust Voice Loading
    initSpeech() {
        if (!this.speechSynthesis) return;

        // Chrome loads voices asynchronously
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
        this.loadVoices();
    }

    loadVoices() {
        const voices = this.speechSynthesis.getVoices();
        // Try to find a Lithuanian voice, otherwise fallback to null (system default)
        this.selectedVoice = voices.find(voice => voice.lang.includes(this.CONFIG.SPEECH_LANG_TARGET));
        
        if (this.selectedVoice) {
            console.log(`Voice loaded: ${this.selectedVoice.name}`);
        }
    }
    
    setupEventListeners() {
        this.speakerBtn.addEventListener('click', () => this.speakWord());
        this.prevBtn.addEventListener('click', () => this.previousWord());
        this.nextBtn.addEventListener('click', () => this.nextWord());
        
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft': e.preventDefault(); this.previousWord(); break;
                case 'ArrowRight': e.preventDefault(); this.nextWord(); break;
                case ' ': e.preventDefault(); this.speakWord(); break;
            }
        });
        
        // REFACTOR: Unified Pointer Events (Handles Mouse, Touch, and Pen)
        // Note: Ensure CSS for #wordCard has 'touch-action: none' to prevent scrolling while swiping
        this.wordCard.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        this.wordCard.addEventListener('pointerup', (e) => this.handlePointerUp(e));
        // pointercancel handles interruptions (like a phone call or scrolling taking over)
        this.wordCard.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
    }
    
    generateDots() {
        this.dotsNavigation.innerHTML = '';
        this.dots = [];
        
        this.words.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('aria-label', `Go to word ${i + 1}`); // Accessibility
            dot.addEventListener('click', () => this.goToWord(i));
            this.dotsNavigation.appendChild(dot);
            this.dots.push(dot);
        });
    }
    
    updateDisplay() {
        const wordObj = this.words[this.currentIndex];
        
        // Visual Text
        this.wordDisplay.textContent = wordObj.display;
        
        // REFACTOR: Accessibility
        // Screen readers will read the clean text, ignoring the visual gaps
        this.wordDisplay.setAttribute('aria-label', wordObj.text); 
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
