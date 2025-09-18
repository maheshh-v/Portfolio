// Geometric Neural Mesh Background
class NeuralMesh {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.meshPoints = [];
        this.triangles = [];
        this.animationId = null;
        this.time = 0;
        this.init();
    }

    init() {
        this.createCanvas();
        this.generateMesh();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'neural-mesh';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -4;
            opacity: 0.08;
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

    generateMesh() {
        this.meshPoints = [];
        this.triangles = [];
        
        const spacing = 120;
        const cols = Math.ceil(this.canvas.width / spacing) + 1;
        const rows = Math.ceil(this.canvas.height / spacing) + 1;
        
        // Generate mesh points
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.meshPoints.push({
                    x: i * spacing + (Math.random() - 0.5) * 40,
                    y: j * spacing + (Math.random() - 0.5) * 40,
                    originalX: i * spacing,
                    originalY: j * spacing,
                    phase: Math.random() * Math.PI * 2,
                    amplitude: Math.random() * 20 + 10
                });
            }
        }
        
        // Generate triangles
        for (let i = 0; i < cols - 1; i++) {
            for (let j = 0; j < rows - 1; j++) {
                const topLeft = i * rows + j;
                const topRight = (i + 1) * rows + j;
                const bottomLeft = i * rows + (j + 1);
                const bottomRight = (i + 1) * rows + (j + 1);
                
                if (topLeft < this.meshPoints.length && 
                    topRight < this.meshPoints.length && 
                    bottomLeft < this.meshPoints.length && 
                    bottomRight < this.meshPoints.length) {
                    
                    // Create two triangles per quad
                    this.triangles.push({
                        points: [topLeft, topRight, bottomLeft],
                        opacity: Math.random() * 0.3 + 0.1
                    });
                    
                    this.triangles.push({
                        points: [topRight, bottomRight, bottomLeft],
                        opacity: Math.random() * 0.3 + 0.1
                    });
                }
            }
        }
    }

    animate() {
        this.time += 0.01;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update mesh points with wave motion
        this.meshPoints.forEach(point => {
            point.x = point.originalX + Math.sin(this.time + point.phase) * point.amplitude * 0.5;
            point.y = point.originalY + Math.cos(this.time * 0.7 + point.phase) * point.amplitude * 0.3;
        });
        
        // Draw triangles
        this.triangles.forEach(triangle => {
            const p1 = this.meshPoints[triangle.points[0]];
            const p2 = this.meshPoints[triangle.points[1]];
            const p3 = this.meshPoints[triangle.points[2]];
            
            if (p1 && p2 && p3) {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.lineTo(p3.x, p3.y);
                this.ctx.closePath();
                
                // Gradient fill
                const centerX = (p1.x + p2.x + p3.x) / 3;
                const centerY = (p1.y + p2.y + p3.y) / 3;
                
                const gradient = this.ctx.createRadialGradient(
                    centerX, centerY, 0,
                    centerX, centerY, 50
                );
                
                const waveIntensity = Math.sin(this.time * 2 + centerX * 0.01 + centerY * 0.01) * 0.5 + 0.5;
                
                gradient.addColorStop(0, `rgba(100, 255, 218, ${triangle.opacity * waveIntensity})`);
                gradient.addColorStop(1, `rgba(0, 255, 255, ${triangle.opacity * 0.3})`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
                
                // Subtle stroke
                this.ctx.strokeStyle = `rgba(100, 255, 218, ${triangle.opacity * 0.2})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            this.generateMesh();
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

// Initialize neural mesh
document.addEventListener('DOMContentLoaded', () => {
    new NeuralMesh();
});