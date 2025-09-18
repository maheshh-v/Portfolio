// Enhanced Portfolio Effects
class PortfolioEffects {
    constructor() {
        this.sounds = {};
        this.soundEnabled = true;
        this.init();
    }

    init() {
        this.initMorphingShapes();
        this.initGlitchText();
        this.initMatrixRain();
        this.createCustomCursor();
    }

    // Parallax Scrolling
    initParallax() {
        // Disabled to fix layout issues
    }

    // Morphing SVG Shapes
    initMorphingShapes() {
        const shapes = [
            "M50,10 L90,90 L10,90 Z", // Triangle
            "M50,5 L85,25 L85,75 L50,95 L15,75 L15,25 Z", // Hexagon
            "M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0", // Circle
            "M10,10 L90,10 L90,90 L10,90 Z" // Square
        ];

        const morphingSVGs = document.querySelectorAll('.morphing-shape path');
        let currentShape = 0;

        window.addEventListener('scroll', () => {
            const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
            const shapeIndex = Math.floor(scrollPercent * shapes.length);
            
            if (shapeIndex !== currentShape && shapeIndex < shapes.length) {
                currentShape = shapeIndex;
                morphingSVGs.forEach(path => {
                    path.style.transition = 'all 0.8s ease-in-out';
                    path.setAttribute('d', shapes[currentShape]);
                });
            }
        });
    }

    // Glitch Text Effect
    initGlitchText() {
        const glitchElements = document.querySelectorAll('.glitch-text');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.startGlitch(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.stopGlitch(element);
            });
        });
    }

    startGlitch(element) {
        const originalText = element.textContent;
        const glitchChars = '01';
        let glitchInterval;
        
        element.classList.add('glitching');
        
        glitchInterval = setInterval(() => {
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.05) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            element.textContent = glitchedText;
        }, 100);
        
        element.glitchInterval = glitchInterval;
        element.originalText = originalText;
        
        setTimeout(() => {
            this.stopGlitch(element);
        }, 150);
    }

    stopGlitch(element) {
        if (element.glitchInterval) {
            clearInterval(element.glitchInterval);
            element.textContent = element.originalText;
            element.classList.remove('glitching');
        }
    }

    // Matrix Rain Effect
    initMatrixRain() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-rain';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0.1;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}01";
        const matrixArray = matrix.split("");

        const fontSize = 12;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(draw, 50);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Sound Effects
    initSoundEffects() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Generate sounds programmatically
        this.generateSounds();
        
        // All sounds disabled - too annoying
    }

    generateSounds() {
        // Click sound
        this.sounds.click = this.createBeep(800, 0.1, 'sine');
        
        // Hover sound
        this.sounds.hover = this.createBeep(600, 0.05, 'sine');
        
        // Glitch sound
        this.sounds.glitch = this.createNoise(0.2);
        
        // Whoosh sound
        this.sounds.whoosh = this.createSweep(200, 800, 0.3);
    }

    createBeep(frequency, duration, type = 'sine') {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createNoise(duration) {
        return () => {
            if (!this.soundEnabled) return;
            
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            source.start();
        };
    }

    createSweep(startFreq, endFreq, duration) {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName] && this.soundEnabled) {
            this.sounds[soundName]();
        }
    }

    createCustomCursor() {
        const cursorDot = document.createElement('div');
        const cursorOutline = document.createElement('div');
        
        cursorDot.className = 'cursor-dot';
        cursorOutline.className = 'cursor-outline';
        
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);
        
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        const animateOutline = () => {
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateOutline);
        };
        animateOutline();
        
        document.addEventListener('mousedown', () => {
            cursorDot.classList.add('hover');
            cursorOutline.classList.add('hover');
        });
        
        document.addEventListener('mouseup', () => {
            cursorDot.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        });
        
        document.querySelectorAll('button, a, .btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorOutline.classList.remove('hover');
            });
        });
    }
    
    createSoundToggle() {
        const toggle = document.createElement('div');
        toggle.innerHTML = `
            <button id="sound-toggle" class="sound-toggle ${this.soundEnabled ? 'enabled' : 'disabled'}">
                <i class="fas fa-volume-up"></i>
            </button>
        `;
        document.body.appendChild(toggle);

        const button = document.getElementById('sound-toggle');
        button.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            button.classList.toggle('enabled');
            button.classList.toggle('disabled');
            button.innerHTML = `<i class="fas fa-volume-${this.soundEnabled ? 'up' : 'mute'}"></i>`;
        });
    }
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioEffects();
});