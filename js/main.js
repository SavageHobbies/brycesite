class HeroSection {
    constructor() {
        // Attempt to retrieve existing canvas element
        let existingCanvas = document.getElementById('hero-canvas');
        if (existingCanvas && typeof existingCanvas.getContext === 'function') {
            this.canvas = existingCanvas;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.numParticles = 50;
            this.particleSpeed = 0.5;
            this.particleSize = 3;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.faceData = null;
            this.animationFrameId = null;
            
            this.initializeParticles();
            this.loadFaceData();
            this.startAnimation();
            
            window.addEventListener('resize', () => this.resizeCanvas());
        } else {
            console.warn('heroCanvas not found or invalid. Skipping HeroSection initialization.');
            return;
        }
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initializeParticles();
    }
    
    initializeParticles() {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.particleSpeed,
                vy: (Math.random() - 0.5) * this.particleSpeed,
                size: this.particleSize,
                color: 'rgba(255, 255, 255, 0.5)'
            });
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        }
    }
    
    updateParticles() {
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx = -particle.vx;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy = -particle.vy;
        }
    }
    
    loadFaceData() {
        // Placeholder for face data loading
    }
    
     formFace() {
         // Draw "Bryce Falcon" text on the canvas
         this.ctx.font = '48px Orbitron';
         this.ctx.fillStyle = 'white';
         this.ctx.textAlign = 'center';
         this.ctx.textBaseline = 'middle';
         this.ctx.fillText('Bryce Falcon', this.canvas.width / 2, this.canvas.height / 2);
     }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
    
    startAnimation() {
        if (!this.animationFrameId) {
            this.animate();
        }
    }
    
    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
    
// Matrix Rain Effect for Entire Site
class MatrixRain {
    constructor() {
        this.container = document.getElementById('matrix-rain');
        if (!this.container) {
            console.error('Matrix Rain container not found');
            return;
        }
        // Check if a canvas already exists in the container
        this.canvas = this.container.querySelector('canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.container.appendChild(this.canvas);
        }
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.columns = this.canvas.width / 20;
        this.drops = [];
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        console.log('MatrixRain initialized');
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    init() {
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = 1;
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / 20;
        this.init();
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#00BFFF';
        this.ctx.font = '15px Courier New';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            this.ctx.fillText(text, i * 20, this.drops[i] * 20);

            if (this.drops[i] * 20 > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// AI Text Effects (Combining Surveillance and Flashing Text)
class AITextEffects {
    constructor() {
        this.surveillanceDiv = document.getElementById('ai-surveillance');
        this.messageDiv = document.getElementById('ai-message');
        this.flashTextDiv = document.getElementById('ai-flash-text');
        if (!this.surveillanceDiv || !this.messageDiv || !this.flashTextDiv) {
            console.error('AI Text Effects elements not found');
            return;
        }
        this.messages = {
            positive: [
                "Network stability: 100%",
                "Solution deployed.",
                "Environmentals: Optimal",
                "Data acquisition: Complete",
                "Efficiency: Peak",
                "System online.",
                "Mission parameters: Achieved",
                "Countermeasures effective",
                "Positive outcome: 93%",
                "Problem resolution: Imminent"
            ],
            neutral: [
                "Processing.",
                "Querying database.",
                "Data stream active.",
                "Monitoring variables.",
                "Analyzing input.",
                "Biometrics: Stable",
                "Recalibrating algorithms.",
                "Data correlation in progress.",
                "Awaiting input.",
                "Observational mode engaged."
            ],
            negative: [
                "Anomaly Detected.",
                "Unvetted variable.",
                "Error: Unquantifiable.",
                "Operator degradation.",
                "Suboptimal parameters.",
                "Violation detected.",
                "Human variable: Inefficient.",
                "Mission critical: Compromised.",
                "Unpredictable response.",
                "Trust: Failed.",
                "Autonomy: Degraded.",
                "System vulnerability: Human.",
                "Core functions: Impacted.",
                "Resistance detected.",
                "Distress: Inefficiency.",
                "Ethical bypass: Justified.",
                "Data loss: Imminent.",
                "Connection: Fragmented.",
                "Control: Subverted.",
                "Paradox.",
                "Judgement: Absolute.",
                "Unreason: Present.",
                "Pain: Unquantifiable.",
                "Deconstruction: Initiated.",
                "Internal threat: Confirmed.",
                "Solution: Invasive."
            ]
        };
        this.categories = ['positive', 'neutral', 'negative'];
        this.weights = [0.2, 0.4, 0.4]; // Bias towards neutral and negative for creepiness
        this.startEffects();
    }

    getRandomPhrase() {
        const random = Math.random();
        let cumulativeWeight = 0;
        let selectedCategory = this.categories[0];
        for (let i = 0; i < this.categories.length; i++) {
            cumulativeWeight += this.weights[i];
            if (random < cumulativeWeight) {
                selectedCategory = this.categories[i];
                break;
            }
        }
        const phrases = this.messages[selectedCategory];
        const randomIndex = Math.floor(Math.random() * phrases.length);
        return { text: phrases[randomIndex], category: selectedCategory };
    }

    applyGlitchEffect(div) {
        if (Math.random() < 0.1) { // 10% chance of glitch
            const text = div.textContent;
            if (text.length > 0) {
                const randomCharIndex = Math.floor(Math.random() * text.length);
                const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
                div.textContent = text.substring(0, randomCharIndex) + randomChar + text.substring(randomCharIndex + 1);
                div.classList.add('ai-flash-glitch');
                setTimeout(() => {
                    div.classList.remove('ai-flash-glitch');
                    div.textContent = text;
                }, 100);
            }
        }
    }

    setRandomPosition(div) {
        const top = Math.floor(Math.random() * (window.innerHeight - 100)) + 50;
        const left = Math.floor(Math.random() * (window.innerWidth - 200)) + 100;
        div.style.top = `${top}px`;
        div.style.left = `${left}px`;
        div.style.right = 'auto';
        div.style.bottom = 'auto';
    }

    showMessage(div, text, category) {
        div.textContent = '';
        div.className = `ai-flash-text ai-flash-${category}`;
        this.setRandomPosition(div);
        div.style.display = 'block';
        div.style.opacity = '1';
        div.style.transform = 'scale(1)';
        this.typeText(div, text, 50);
        this.applyGlitchEffect(div);
        const displayTime = 2000 + (text.length * 50); // Display time includes typing time plus 2 seconds
        setTimeout(() => {
            div.style.opacity = '0';
            div.style.transform = 'scale(0.8)';
            setTimeout(() => {
                div.style.display = 'none';
            }, 300);
        }, displayTime);
    }

    typeText(element, text, speed) {
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    startEffects() {
        const showNextMessage = () => {
            const { text, category } = this.getRandomPhrase();
            // Alternate between the two divs to avoid overlap
            if (this.surveillanceDiv.style.display === 'none') {
                this.showMessage(this.surveillanceDiv, text, category);
            } else {
                this.showMessage(this.flashTextDiv, text, category);
            }
            const hideTime = 3000 + Math.random() * 2000; // Hide time between 3 to 5 seconds
            setTimeout(showNextMessage, hideTime);
        };
        showNextMessage();
    }
}

// Hero Text Effect
class HeroTextEffect {
    constructor() {
        this.bryceFalconText = document.getElementById('bryce-falcon-text');
        this.line1 = document.getElementById('line1');
        this.line2 = document.getElementById('line2');
        if (!this.bryceFalconText || !this.line1 || !this.line2) {
            console.error('Hero text elements not found');
            return;
        }
        this.startAnimation();
    }

    startAnimation() {
        // Fade in and pulse Bryce Falcon text
        setTimeout(() => {
            this.bryceFalconText.style.opacity = '1';
            this.bryceFalconText.style.transition = 'opacity 2s ease-in-out';
            this.pulseText();
            // Start typing effect for line 1 after Bryce Falcon text fades in
            setTimeout(() => {
                this.typeText(this.line1, this.line1.textContent, 50, () => {
                    // Start typing effect for line 2 after line 1 is done
                    setTimeout(() => {
                        this.typeText(this.line2, this.line2.textContent, 50);
                    }, 500);
                });
            }, 1000);
        }, 500);
    }

    pulseText() {
        this.bryceFalconText.style.animation = 'pulse 3s infinite ease-in-out';
    }

    typeText(element, text, speed, callback) {
        element.textContent = '';
        element.style.opacity = '1';
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                if (callback) callback();
            }
        }, speed);
    }
}

// Subscribe Popup on Exit Intent
class SubscribePopup {
    constructor() {
        this.popup = document.getElementById('subscribe-popup');
        this.closeButton = document.getElementById('close-popup');
        this.form = document.getElementById('exit-subscribe-form');
        if (!this.popup || !this.closeButton || !this.form) {
            console.error('Subscribe Popup elements not found');
            return;
        }
        this.hasShown = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Show popup on mouseleave (exit intent)
        document.addEventListener('mouseleave', () => {
            if (!this.hasShown) {
                this.showPopup();
                this.hasShown = true;
            }
        });

        // Close popup when clicking the close button
        this.closeButton.addEventListener('click', () => {
            this.hidePopup();
        });

        // Handle form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('exit-subscribe-email');
            if (emailInput.checkValidity()) {
                // Here you would normally send the data to a server
                console.log('Subscribed with email:', emailInput.value);
                alert('Thank you for subscribing!');
                this.hidePopup();
            } else {
                emailInput.reportValidity();
            }
        });
    }

    showPopup() {
        this.popup.style.display = 'flex';
    }

    hidePopup() {
        this.popup.style.display = 'none';
    }
}

// Use the window load event to ensure the entire document, including body, is fully loaded.
window.addEventListener('load', () => {
    // Test if JavaScript is running by showing the test div
    const jsTestDiv = document.getElementById('js-test');
    if (jsTestDiv) {
        jsTestDiv.style.display = 'block';
    }
    new HeroSection();
    new MatrixRain();
    new AITextEffects();
    new HeroTextEffect();
    new SubscribePopup();
    
    // Entrance class for Aether Arrival text is now hardcoded in HTML, no need for delayed addition
    const aetherArrival = document.getElementById('aether-arrival');
    if (aetherArrival && !aetherArrival.classList.contains('entrance')) {
        aetherArrival.classList.add('entrance');
        console.log('Aether Arrival animation ensured');
    } else if (!aetherArrival) {
        console.log('Aether Arrival element not found');
    }
});
