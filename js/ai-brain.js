// Minimal AI Brain Animation
class AIBrain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createNodes();
        this.createConnections();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ai-brain';
        this.canvas.style.cssText = `
            position: absolute;
            top: 50%;
            right: 10%;
            transform: translateY(-50%);
            width: 300px;
            height: 300px;
            opacity: 0.6;
            pointer-events: none;
            z-index: 1;
        `;
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.appendChild(this.canvas);
            this.canvas.width = 300;
            this.canvas.height = 300;
            this.ctx = this.canvas.getContext('2d');
        }
    }
    
    createNodes() {
        const nodeCount = 15;
        const centerX = 150;
        const centerY = 150;
        const radius = 80;
        
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * (radius + Math.random() * 40 - 20);
            const y = centerY + Math.sin(angle) * (radius + Math.random() * 40 - 20);
            
            this.nodes.push({
                x,
                y,
                size: 2 + Math.random() * 2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02
            });
        }
    }
    
    createConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(this.nodes[i].x - this.nodes[j].x, 2) +
                    Math.pow(this.nodes[i].y - this.nodes[j].y, 2)
                );
                
                if (distance < 100 && Math.random() > 0.7) {
                    this.connections.push({
                        from: i,
                        to: j,
                        pulse: Math.random() * Math.PI * 2,
                        pulseSpeed: 0.01 + Math.random() * 0.01
                    });
                }
            }
        }
    }
    
    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, 300, 300);
        
        // Draw connections
        this.connections.forEach(conn => {
            const from = this.nodes[conn.from];
            const to = this.nodes[conn.to];
            
            conn.pulse += conn.pulseSpeed;
            const opacity = 0.1 + Math.sin(conn.pulse) * 0.1;
            
            this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.stroke();
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            node.pulse += node.pulseSpeed;
            const size = node.size + Math.sin(node.pulse) * 0.5;
            const opacity = 0.6 + Math.sin(node.pulse) * 0.2;
            
            this.ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow effect
            this.ctx.shadowColor = '#00d4ff';
            this.ctx.shadowBlur = 5;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize on mobile check
if (window.innerWidth > 768) {
    document.addEventListener('DOMContentLoaded', () => {
        new AIBrain();
    });
}