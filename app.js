// At Our Pace - Main Application
class AtOurPaceApp {
    constructor() {
        this.config = null;
        this.state = {
            mode: 'everyday',
            pace: 'yellow',
            nextMeetISO: null,
            checkins: {},
            hotTakes: [],
            songs: [],
            commitments: {},
            gratitude: {},
            focus: {
                task: '',
                timer: null,
                startTime: null
            },
            rpsLastResult: null
        };
        
        this.microPromises = [
            "I'll be patient.",
            "I'll listen first.",
            "I choose you (at your pace).",
            "I'm here for the long haul.",
            "We'll figure this out together."
        ];
        
        this.commitmentItems = [
            "Match pace, don't drag",
            "Honest, kind truth",
            "Repair > win"
        ];
        
        this.init();
    }

    async init() {
        try {
            await this.loadConfig();
            this.loadState();
            this.setupEventListeners();
            this.render();
            this.startCountdown();
            this.startMicroPromiseRotation();
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    async loadConfig() {
        try {
            const response = await fetch('config.json');
            this.config = await response.json();
            this.state.nextMeetISO = this.config.nextMeetISO;
            this.state.pace = this.config.pace;
            this.state.mode = this.config.mode;
        } catch (error) {
            console.error('Failed to load config:', error);
            // Fallback config
            this.config = {
                title: "At Our Pace",
                nextMeetISO: "2025-10-04T05:00:00-04:00",
                mode: "everyday",
                pace: "yellow",
                vows: [],
                memories: [],
                songs: []
            };
        }
    }

    loadState() {
        // Load from localStorage
        const savedMode = localStorage.getItem('mode');
        if (savedMode) this.state.mode = savedMode;

        const savedPace = localStorage.getItem('pace');
        if (savedPace) this.state.pace = savedPace;

        const savedNextMeet = localStorage.getItem('nextMeetISO');
        if (savedNextMeet) this.state.nextMeetISO = savedNextMeet;

        const savedCheckins = localStorage.getItem('checkins');
        if (savedCheckins) this.state.checkins = JSON.parse(savedCheckins);

        const savedHotTakes = localStorage.getItem('hotTakes');
        if (savedHotTakes) this.state.hotTakes = JSON.parse(savedHotTakes);

        const savedSongs = localStorage.getItem('songs');
        if (savedSongs) this.state.songs = JSON.parse(savedSongs);

        const savedCommitments = localStorage.getItem('commitments');
        if (savedCommitments) this.state.commitments = JSON.parse(savedCommitments);

        const savedGratitude = localStorage.getItem('gratitude');
        if (savedGratitude) this.state.gratitude = JSON.parse(savedGratitude);

        const savedFocus = localStorage.getItem('focus');
        if (savedFocus) this.state.focus = JSON.parse(savedFocus);

        const savedRpsResult = localStorage.getItem('rpsLastResult');
        if (savedRpsResult) this.state.rpsLastResult = savedRpsResult;
    }

    saveState() {
        localStorage.setItem('mode', this.state.mode);
        localStorage.setItem('pace', this.state.pace);
        localStorage.setItem('nextMeetISO', this.state.nextMeetISO);
        localStorage.setItem('checkins', JSON.stringify(this.state.checkins));
        localStorage.setItem('hotTakes', JSON.stringify(this.state.hotTakes));
        localStorage.setItem('songs', JSON.stringify(this.state.songs));
        localStorage.setItem('commitments', JSON.stringify(this.state.commitments));
        localStorage.setItem('gratitude', JSON.stringify(this.state.gratitude));
        localStorage.setItem('focus', JSON.stringify(this.state.focus));
        localStorage.setItem('rpsLastResult', this.state.rpsLastResult);
    }

    setupEventListeners() {
        // Mode toggle
        document.getElementById('mode-btn').addEventListener('click', () => {
            this.toggleMode();
        });

        // Check-in slider
        document.getElementById('checkin-slider').addEventListener('input', (e) => {
            this.updateCheckin(parseInt(e.target.value));
        });

        // Hot take button
        document.getElementById('hot-take-btn').addEventListener('click', () => {
            this.addHotTake();
        });

        // Add song button
        document.getElementById('add-song-btn').addEventListener('click', () => {
            this.addSong();
        });

        // Reset commitments
        document.getElementById('reset-commitments').addEventListener('click', () => {
            this.resetCommitments();
        });

        // Shuffle memories
        document.getElementById('shuffle-memories').addEventListener('click', () => {
            this.shuffleMemories();
        });

        // Focus timer
        document.getElementById('start-timer').addEventListener('click', () => {
            this.startFocusTimer();
        });

        // RPS
        document.getElementById('rps-trigger').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRPS();
        });

        document.querySelectorAll('.rps-choice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.playRPS(e.target.dataset.choice);
            });
        });

        document.getElementById('close-rps').addEventListener('click', () => {
            this.hideRPS();
        });

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.toggleSettings();
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            this.hideSettings();
        });

        document.getElementById('next-meet-input').addEventListener('change', (e) => {
            this.updateNextMeet(e.target.value);
        });

        document.getElementById('pace-select').addEventListener('change', (e) => {
            this.updatePace(e.target.value);
        });

        document.getElementById('high-contrast-toggle').addEventListener('change', (e) => {
            this.toggleHighContrast(e.target.checked);
        });

        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('clear-data').addEventListener('click', () => {
            this.clearData();
        });

        // Gratitude inputs
        this.setupGratitudeListeners();
    }

    setupGratitudeListeners() {
        const gratitudeSlots = document.getElementById('gratitude-slots');
        for (let i = 0; i < 3; i++) {
            const input = gratitudeSlots.children[i].querySelector('input');
            input.addEventListener('input', (e) => {
                this.updateGratitude(i, e.target.value);
            });
        }
    }

    render() {
        this.renderHeader();
        this.renderHero();
        this.renderMicroRituals();
        this.renderUsPanel();
        this.renderMemoryLane();
        this.renderGratitudeLog();
        this.renderFocusBlock();
        this.renderRPS();
        this.renderSettings();
    }

    renderHeader() {
        document.getElementById('site-title').textContent = this.config.title;
        const modeBtn = document.getElementById('mode-btn');
        modeBtn.textContent = this.state.mode === 'everyday' ? 'Everyday' : 'Space';
        modeBtn.setAttribute('aria-pressed', this.state.mode === 'space');
    }

    renderHero() {
        const paceRing = document.getElementById('pace-ring');
        paceRing.className = `pace-ring ${this.state.pace}`;
        
        const tooltip = document.getElementById('pace-tooltip');
        const tooltips = {
            green: 'Open & easy',
            yellow: 'Go slow',
            red: 'Pause & breathe'
        };
        tooltip.textContent = tooltips[this.state.pace];

        const subline = document.querySelector('.subline');
        if (this.state.mode === 'space') {
            subline.textContent = "I'm here. I'm patient. I'm not going anywhere.";
        } else {
            subline.textContent = "What matters most is that we keep moving forward together.";
        }
    }

    renderMicroRituals() {
        const microRituals = document.getElementById('micro-rituals');
        if (this.state.mode === 'space') {
            microRituals.classList.add('hidden');
        } else {
            microRituals.classList.remove('hidden');
        }

        this.renderSongs();
        this.renderCheckin();
        this.renderHotTakes();
    }

    renderSongs() {
        const container = document.getElementById('songs-container');
        const songs = [...(this.config.songs || []), ...this.state.songs];
        const latestSongs = songs.slice(-2);

        container.innerHTML = latestSongs.map(song => `
            <div class="song-item">
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-note">${song.note}</div>
                </div>
                <div class="song-from">${song.from}</div>
                <a href="${song.url}" target="_blank" rel="noopener">🎵</a>
            </div>
        `).join('');
    }

    renderCheckin() {
        const today = this.getTodayKey();
        const todayCheckin = this.state.checkins[today] || 5;
        
        document.getElementById('checkin-slider').value = todayCheckin;
        document.getElementById('checkin-value').textContent = todayCheckin;
        document.getElementById('checkin-emoji').textContent = this.getCheckinEmoji(todayCheckin);

        this.renderCheckinHistory();
    }

    renderCheckinHistory() {
        const history = document.getElementById('checkin-history');
        const dates = Object.keys(this.state.checkins).sort().slice(-3);
        
        history.innerHTML = dates.map(date => {
            const value = this.state.checkins[date];
            return `<div class="checkin-badge">${date}: ${value}</div>`;
        }).join('');
    }

    renderHotTakes() {
        const container = document.getElementById('hot-takes');
        container.innerHTML = this.state.hotTakes.slice(-5).map(take => 
            `<div class="hot-take-pill">${take}</div>`
        ).join('');
    }

    renderUsPanel() {
        this.renderVows();
        this.renderCommitments();
    }

    renderVows() {
        const container = document.getElementById('vows-list');
        container.innerHTML = this.config.vows.map(vow => 
            `<li>${vow}</li>`
        ).join('');
    }

    renderCommitments() {
        const container = document.getElementById('commitment-list');
        container.innerHTML = this.commitmentItems.map((item, index) => `
            <div class="commitment-item">
                <input type="checkbox" id="commitment-${index}" ${this.state.commitments[index] ? 'checked' : ''}>
                <label for="commitment-${index}">${item}</label>
            </div>
        `).join('');

        // Add event listeners
        this.commitmentItems.forEach((_, index) => {
            document.getElementById(`commitment-${index}`).addEventListener('change', (e) => {
                this.updateCommitment(index, e.target.checked);
            });
        });
    }

    renderMemoryLane() {
        const container = document.getElementById('memories-grid');
        container.innerHTML = this.config.memories.map(memory => `
            <div class="memory-item">
                <img src="${memory.img}" alt="${memory.title}" class="memory-image" onerror="this.style.display='none'">
                <div class="memory-date">${this.formatDate(memory.date)}</div>
                <div class="memory-title">${memory.title}</div>
                <div class="memory-line">${memory.line}</div>
            </div>
        `).join('');
    }

    renderGratitudeLog() {
        const container = document.getElementById('gratitude-slots');
        const today = this.getTodayKey();
        const todayGratitude = this.state.gratitude[today] || ['', '', ''];

        container.innerHTML = todayGratitude.map((item, index) => `
            <div class="gratitude-slot ${item ? 'completed' : ''}">
                <input type="text" value="${item}" ${item ? 'disabled' : ''} placeholder="What I appreciated about you today">
                ${item ? '<span class="gratitude-check">✓</span>' : ''}
            </div>
        `).join('');

        this.setupGratitudeListeners();
    }

    renderFocusBlock() {
        const input = document.getElementById('focus-input');
        const timerDisplay = document.getElementById('timer-display');
        
        input.value = this.state.focus.task;

        if (this.state.focus.timer && this.state.focus.startTime) {
            const elapsed = Date.now() - this.state.focus.startTime;
            const remaining = Math.max(0, 30 * 60 * 1000 - elapsed);
            
            if (remaining > 0) {
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
            } else {
                timerDisplay.textContent = 'Done ✅';
                this.state.focus.timer = null;
                this.state.focus.startTime = null;
                this.saveState();
            }
        } else {
            timerDisplay.textContent = '';
        }
    }

    renderRPS() {
        // RPS is rendered in HTML, just need to show/hide
    }

    renderSettings() {
        document.getElementById('next-meet-input').value = this.state.nextMeetISO ? 
            new Date(this.state.nextMeetISO).toISOString().slice(0, 16) : '';
        document.getElementById('pace-select').value = this.state.pace;
        
        const highContrast = localStorage.getItem('highContrast') === 'true';
        document.getElementById('high-contrast-toggle').checked = highContrast;
        if (highContrast) {
            document.body.classList.add('hc');
        }
    }

    startCountdown() {
        if (!this.state.nextMeetISO) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const target = new Date(this.state.nextMeetISO).getTime();
            const distance = target - now;

            if (distance < 0) {
                document.getElementById('days').textContent = '0';
                document.getElementById('hours').textContent = '0';
                document.getElementById('minutes').textContent = '0';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
        };

        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }

    startMicroPromiseRotation() {
        let index = 0;
        const element = document.getElementById('micro-promise');
        
        const rotate = () => {
            if (this.state.mode === 'space') {
                element.textContent = "Breathing room so we can choose clearly.";
                return;
            }
            
            element.style.opacity = '0';
            setTimeout(() => {
                element.textContent = this.microPromises[index];
                element.style.opacity = '1';
                index = (index + 1) % this.microPromises.length;
            }, 300);
        };

        rotate();
        setInterval(rotate, 5000);
    }

    // Event Handlers
    toggleMode() {
        this.state.mode = this.state.mode === 'everyday' ? 'space' : 'everyday';
        this.saveState();
        this.render();
    }

    updateCheckin(value) {
        const today = this.getTodayKey();
        this.state.checkins[today] = value;
        this.saveState();
        this.renderCheckin();
    }

    addHotTake() {
        const take = prompt('Share a thought:');
        if (take && take.trim()) {
            this.state.hotTakes.push(take.trim());
            if (this.state.hotTakes.length > 5) {
                this.state.hotTakes = this.state.hotTakes.slice(-5);
            }
            this.saveState();
            this.renderHotTakes();
        }
    }

    addSong() {
        const title = prompt('Song title:');
        const note = prompt('Why it fits:');
        const from = prompt('From (A or T):');
        const url = prompt('Spotify URL (optional):');

        if (title && note && from) {
            this.state.songs.push({
                date: new Date().toISOString().split('T')[0],
                title,
                note,
                from: from.toUpperCase(),
                url: url || '#'
            });
            this.saveState();
            this.renderSongs();
        }
    }

    resetCommitments() {
        this.state.commitments = {};
        this.saveState();
        this.renderCommitments();
    }

    updateCommitment(index, checked) {
        this.state.commitments[index] = checked;
        this.saveState();
    }

    shuffleMemories() {
        const memories = [...this.config.memories];
        for (let i = memories.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [memories[i], memories[j]] = [memories[j], memories[i]];
        }
        this.config.memories = memories;
        this.renderMemoryLane();
    }

    updateGratitude(index, value) {
        const today = this.getTodayKey();
        if (!this.state.gratitude[today]) {
            this.state.gratitude[today] = ['', '', ''];
        }
        this.state.gratitude[today][index] = value;
        this.saveState();
        this.renderGratitudeLog();
    }

    startFocusTimer() {
        const input = document.getElementById('focus-input');
        const task = input.value.trim();
        
        if (!task) {
            alert('Please enter a task first');
            return;
        }

        this.state.focus.task = task;
        this.state.focus.timer = true;
        this.state.focus.startTime = Date.now();
        this.saveState();
        this.renderFocusBlock();

        // Update timer display every second
        const timerInterval = setInterval(() => {
            if (!this.state.focus.timer) {
                clearInterval(timerInterval);
                return;
            }
            this.renderFocusBlock();
        }, 1000);
    }

    showRPS() {
        document.getElementById('rps-modal').classList.add('show');
    }

    hideRPS() {
        document.getElementById('rps-modal').classList.remove('show');
    }

    playRPS(choice) {
        const choices = ['rock', 'paper', 'scissors'];
        const opponentChoice = choices[Math.floor(Math.random() * choices.length)];
        
        const beats = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        let result;
        if (choice === opponentChoice) {
            result = 'Tie!';
        } else if (beats[choice] === opponentChoice) {
            result = 'You win! 🎉';
            this.createConfetti();
        } else {
            result = 'You lose!';
        }

        document.getElementById('rps-result').textContent = 
            `You: ${this.getRPSEmoji(choice)} vs Opponent: ${this.getRPSEmoji(opponentChoice)} - ${result}`;
        
        this.state.rpsLastResult = result;
        this.saveState();
    }

    getRPSEmoji(choice) {
        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        return emojis[choice];
    }

    createConfetti() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    toggleSettings() {
        document.getElementById('settings-drawer').classList.toggle('open');
    }

    hideSettings() {
        document.getElementById('settings-drawer').classList.remove('open');
    }

    updateNextMeet(value) {
        this.state.nextMeetISO = new Date(value).toISOString();
        this.saveState();
        this.startCountdown();
    }

    updatePace(value) {
        this.state.pace = value;
        this.saveState();
        this.renderHero();
    }

    toggleHighContrast(enabled) {
        localStorage.setItem('highContrast', enabled);
        if (enabled) {
            document.body.classList.add('hc');
        } else {
            document.body.classList.remove('hc');
        }
    }

    exportData() {
        const data = {
            mode: this.state.mode,
            pace: this.state.pace,
            nextMeetISO: this.state.nextMeetISO,
            checkins: this.state.checkins,
            hotTakes: this.state.hotTakes,
            songs: this.state.songs,
            commitments: this.state.commitments,
            gratitude: this.state.gratitude,
            focus: this.state.focus,
            rpsLastResult: this.state.rpsLastResult
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'at-our-pace-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    clearData() {
        if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    }

    // Utility Methods
    getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }

    getCheckinEmoji(value) {
        const emojis = ['😢', '😕', '😐', '🙂', '😊', '😄', '🤗', '🥰', '😍', '🤩', '🎉'];
        return emojis[Math.min(value - 1, emojis.length - 1)];
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AtOurPaceApp();
});
