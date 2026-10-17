/**
 * Sound Engine for SkillSphere
 * Plays Jack Sparrow soundtrack from the project folder on toggle
 */
class JackSparrowSoundEngine {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.listeners = [];
    }

    init() {
        if (!this.audio) {
            // Primary path: /JackSparrow.mpeg in client public folder
            this.audio = new Audio('/JackSparrow.mpeg');
            this.audio.loop = true;
            this.audio.volume = 0.75;

            // Handle errors by falling back to mp3 alias if needed
            this.audio.addEventListener('error', (e) => {
                console.warn('Retrying with jacksparrow.mp3 fallback...', e);
                this.audio.src = '/jacksparrow.mp3';
                if (this.isPlaying) {
                    this.audio.play().catch(err => console.error('Audio playback error:', err));
                }
            });

            this.audio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.notify();
            });
        }
    }

    notify() {
        this.listeners.forEach(cb => cb(this.isPlaying));
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    start() {
        this.init();
        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.notify();
                })
                .catch(err => {
                    console.error('Audio playback was prevented by browser policy:', err);
                    this.isPlaying = false;
                    this.notify();
                });
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
        }
        this.isPlaying = false;
        this.notify();
    }

    toggle() {
        this.init();
        if (this.isPlaying && this.audio && !this.audio.paused) {
            this.stop();
            return false;
        } else {
            this.start();
            return true;
        }
    }
}

export const ambientSound = new JackSparrowSoundEngine();
