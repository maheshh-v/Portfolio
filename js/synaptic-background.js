// Synaptic Connections Background
class SynapticBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.synapses = [];
        this.signals = [];
        this.animationId = null;
        this.time = 0;
        this.init();
    }

    init() {
        this.createCanvas();
        this.generateSynapses();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'synaptic-bg';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -3;
            opacity: 0.05;
            pointer-events: none;
            filter: blur(1px);
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    generateSynapses() {
        this.synapses = [];
        const count = Math.floor((this.canvas.width * this.canvas.height) / 25000);
        
        for (let i = 0; i < count; i++) {
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            const length = Math.random() * 200 + 100;
            const angle = Math.random() * Math.PI * 2;
            
            this.synapses.push({
                startX,
                startY,
                endX: startX + Math.cos(angle) * length,
                endY: startY + Math.sin(angle) * length,
                branches: this.createBranches(startX, startY, angle, length),
                lastSignal: 0,
                activity: Math.random()
            });
        }
    }

    createBranches(x, y, mainAngle, mainLength) {
        const branches = [];
        const branchCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < branchCount; i++) {
            const branchAngle = mainAngle + (Math.random() - 0.5) * Math.PI * 0.8;
            const branchLength = mainLength * (0.3 + Math.random() * 0.4);
            const startPoint = 0.3 + Math.random() * 0.4; // Branch starts partway along main synapse
            
            const branchStartX = x + Math.cos(mainAngle) * mainLength * startPoint;
            const branchStartY = y + Math.sin(mainAngle) * mainLength * startPoint;
            
            branches.push({
                startX: branchStartX,
                startY: branchStartY,
                endX: branchStartX + Math.cos(branchAngle) * branchLength,
                endY: branchStartY + Math.sin(branchAngle) * branchLength
            });
        }
        
        return branches;
    }

    createSignal(synapseIndex) {
        const synapse = this.synapses[synapseIndex];
        if (Date.now() - synapse.lastSignal > 1500) {
            this.signals.push({
                synapseIndex,
                progress: 0,
                speed: 0.015 + Math.random() * 0.02,
                intensity: 0.5 + Math.random() * 0.5,
                type: Math.random() < 0.7 ? 'main' : 'branch',
                branchIndex: Math.floor(Math.random() * synapse.branches.length)
            });
            synapse.lastSignal = Date.now();
        }
    }

    animate() {
        this.time += 0.016;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw synapses
        this.synapses.forEach((synapse, index) => {
            // Main synapse
            this.ctx.beginPath();
            this.ctx.moveTo(synapse.startX, synapse.startY);
            this.ctx.lineTo(synapse.endX, synapse.endY);
            this.ctx.strokeStyle = `rgba(100, 255, 218, ${0.3 + synapse.activity * 0.2})`;
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
            
            // Synaptic terminal (end point)
            this.ctx.beginPath();
            this.ctx.arc(synapse.endX, synapse.endY, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 255, ${0.4 + synapse.activity * 0.3})`;
            this.ctx.fill();
            
            // Branches
            synapse.branches.forEach(branch => {
                this.ctx.beginPath();
                this.ctx.moveTo(branch.startX, branch.startY);
                this.ctx.lineTo(branch.endX, branch.endY);
                this.ctx.strokeStyle = `rgba(100, 255, 218, ${0.2 + synapse.activity * 0.15})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                
                // Branch terminal
                this.ctx.beginPath();
                this.ctx.arc(branch.endX, branch.endY, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 255, ${0.3 + synapse.activity * 0.2})`;
                this.ctx.fill();
            });
        });
        
        // Update and draw signals
        this.signals = this.signals.filter(signal => {
            signal.progress += signal.speed;
            
            if (signal.progress <= 1) {
                const synapse = this.synapses[signal.synapseIndex];
                let x, y;
                
                if (signal.type === 'main') {
                    x = synapse.startX + (synapse.endX - synapse.startX) * signal.progress;
                    y = synapse.startY + (synapse.endY - synapse.startY) * signal.progress;
                } else {
                    const branch = synapse.branches[signal.branchIndex];
                    if (branch) {
                        x = branch.startX + (branch.endX - branch.startX) * signal.progress;
                        y = branch.startY + (branch.endY - branch.startY) * signal.progress;
                    }
                }
                
                if (x && y) {
                    // Signal glow
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(0, 255, 255, ${signal.intensity})`;
                    this.ctx.shadowBlur = 12;
                    this.ctx.shadowColor = '#00ffff';
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                    
                    // Signal core
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 2, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${signal.intensity * 0.9})`;
                    this.ctx.fill();
                }
                
                return true;
            }
            return false;
        });
        
        // Randomly create new signals
        if (Math.random() < 0.03) {
            const randomSynapse = Math.floor(Math.random() * this.synapses.length);
            this.createSignal(randomSynapse);
        }
        
        // Update synapse activity
        this.synapses.forEach(synapse => {
            synapse.activity *= 0.995;
            if (Math.random() < 0.001) {
                synapse.activity = Math.min(1, synapse.activity + 0.3);
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            this.generateSynapses();
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// Initialize synaptic background
document.addEventListener('DOMContentLoaded', () => {
    new SynapticBackground();
});