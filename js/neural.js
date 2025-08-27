// Professional Neural Network Animation
class NeuralNetwork {
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
        this.generateNetwork();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'neural-network';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            opacity: 0.3;
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

    generateNetwork() {
        this.nodes = [];
        this.connections = [];
        
        const nodeCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }

        // Create connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < 150) {
                    this.connections.push({
                        from: i,
                        to: j,
                        strength: 1 - (distance / 150)
                    });
                }
            }
        }
    }

    getDistance(node1, node2) {
        return Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw nodes
        this.nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Update pulse
            node.pulse += node.pulseSpeed;
            
            // Draw node
            const pulseIntensity = Math.sin(node.pulse) * 0.3 + 0.7;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${pulseIntensity * 0.8})`;
            this.ctx.fill();
            
            // Draw glow
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${pulseIntensity * 0.2})`;
            this.ctx.fill();
        });

        // Draw connections
        this.connections.forEach(conn => {
            const fromNode = this.nodes[conn.from];
            const toNode = this.nodes[conn.to];
            
            this.ctx.beginPath();
            this.ctx.moveTo(fromNode.x, fromNode.y);
            this.ctx.lineTo(toNode.x, toNode.y);
            this.ctx.strokeStyle = `rgba(99, 102, 241, ${conn.strength * 0.3})`;
            this.ctx.lineWidth = conn.strength * 2;
            this.ctx.stroke();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            this.generateNetwork();
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

// Initialize neural network
document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetwork();
});