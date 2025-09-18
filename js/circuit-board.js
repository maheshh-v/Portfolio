// Circuit Board Traces Background
class CircuitBoard {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.traces = [];
        this.pulses = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.createCanvas();
        this.generateTraces();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'circuit-board';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -3;
            opacity: 0.15;
            pointer-events: none;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    generateTraces() {
        this.traces = [];
        const gridSize = 80;
        const cols = Math.ceil(this.canvas.width / gridSize);
        const rows = Math.ceil(this.canvas.height / gridSize);

        // Generate grid-based circuit traces
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (Math.random() < 0.3) {
                    const x = i * gridSize;
                    const y = j * gridSize;
                    
                    this.traces.push({
                        points: this.generateTracePath(x, y, gridSize),
                        width: Math.random() * 2 + 1,
                        opacity: Math.random() * 0.5 + 0.3,
                        lastPulse: 0
                    });
                }
            }
        }
    }

    generateTracePath(startX, startY, size) {
        const points = [{ x: startX, y: startY }];
        let currentX = startX;
        let currentY = startY;
        
        // Create L-shaped or straight traces
        const directions = [
            [size, 0], [0, size], [-size, 0], [0, -size]
        ];
        
        const numSegments = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numSegments; i++) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            currentX += direction[0];
            currentY += direction[1];
            
            if (currentX >= 0 && currentX <= this.canvas.width && 
                currentY >= 0 && currentY <= this.canvas.height) {
                points.push({ x: currentX, y: currentY });
            }
        }
        
        return points;
    }

    createPulse() {
        if (this.traces.length === 0) return;
        
        const trace = this.traces[Math.floor(Math.random() * this.traces.length)];
        if (Date.now() - trace.lastPulse > 2000) {
            this.pulses.push({
                trace: trace,
                progress: 0,
                speed: 0.02 + Math.random() * 0.03,
                intensity: Math.random() * 0.8 + 0.2
            });
            trace.lastPulse = Date.now();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw traces
        this.traces.forEach(trace => {
            if (trace.points.length < 2) return;
            
            this.ctx.beginPath();
            this.ctx.moveTo(trace.points[0].x, trace.points[0].y);
            
            for (let i = 1; i < trace.points.length; i++) {
                this.ctx.lineTo(trace.points[i].x, trace.points[i].y);
            }
            
            this.ctx.strokeStyle = `rgba(100, 255, 218, ${trace.opacity})`;
            this.ctx.lineWidth = trace.width;
            this.ctx.stroke();
            
            // Draw connection points
            trace.points.forEach(point => {
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 255, ${trace.opacity * 0.8})`;
                this.ctx.fill();
            });
        });
        
        // Update and draw pulses
        this.pulses = this.pulses.filter(pulse => {
            pulse.progress += pulse.speed;
            
            if (pulse.progress <= 1) {
                const trace = pulse.trace;
                if (trace.points.length >= 2) {
                    const totalLength = trace.points.length - 1;
                    const currentSegment = Math.floor(pulse.progress * totalLength);
                    const segmentProgress = (pulse.progress * totalLength) - currentSegment;
                    
                    if (currentSegment < trace.points.length - 1) {
                        const start = trace.points[currentSegment];
                        const end = trace.points[currentSegment + 1];
                        
                        const x = start.x + (end.x - start.x) * segmentProgress;
                        const y = start.y + (end.y - start.y) * segmentProgress;
                        
                        // Pulse glow
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, 4, 0, Math.PI * 2);
                        this.ctx.fillStyle = `rgba(0, 255, 255, ${pulse.intensity})`;
                        this.ctx.shadowBlur = 10;
                        this.ctx.shadowColor = '#00ffff';
                        this.ctx.fill();
                        this.ctx.shadowBlur = 0;
                    }
                }
                return true;
            }
            return false;
        });
        
        // Randomly create new pulses
        if (Math.random() < 0.02) {
            this.createPulse();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            this.generateTraces();
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

// Initialize circuit board
document.addEventListener('DOMContentLoaded', () => {
    new CircuitBoard();
});