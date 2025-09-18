// Simple 3D Background Engine
class Simple3DBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometricShapes = [];
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createGeometricShapes();
        this.bindEvents();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('3d-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.3);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x6366f1, 0.5);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
    }

    createGeometricShapes() {
        const shapes = [
            { geometry: new THREE.IcosahedronGeometry(2, 0), position: [-15, 10, -10] },
            { geometry: new THREE.OctahedronGeometry(1.5), position: [20, -8, -15] },
            { geometry: new THREE.TetrahedronGeometry(1.8), position: [-25, -15, -8] },
            { geometry: new THREE.DodecahedronGeometry(1.2), position: [15, 15, -20] }
        ];

        shapes.forEach((shapeData, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(index * 0.25, 0.7, 0.5),
                transparent: true,
                opacity: 0.1,
                wireframe: true
            });

            const mesh = new THREE.Mesh(shapeData.geometry, material);
            mesh.position.set(...shapeData.position);
            
            this.geometricShapes.push(mesh);
            this.scene.add(mesh);
        });
    }

    bindEvents() {
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        this.geometricShapes.forEach((shape, index) => {
            shape.rotation.x = elapsedTime * (0.2 + index * 0.05);
            shape.rotation.y = elapsedTime * (0.1 + index * 0.03);
        });

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Simple3DBackground();
});