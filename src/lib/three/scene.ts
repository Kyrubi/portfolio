import * as THREE from 'three';
import vertexShader from './shaders/chrome.vert.glsl';
import fragmentShader from './shaders/chrome.frag.glsl';

export function initChromeScene(canvas: HTMLCanvasElement) {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
	camera.position.z = 4.5;

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);

	const uniforms = {
		uTime: { value: 0 },
		uColorA: { value: new THREE.Color('#c8c8d4') },
		uColorB: { value: new THREE.Color('#4a4e69') }
	};

	const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
	const geometry = new THREE.IcosahedronGeometry(1.3, 1);
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	const wireframeGeometry = new THREE.EdgesGeometry(geometry);
	const wireframeMaterial = new THREE.LineBasicMaterial({
		color: 0xb954ff,
		transparent: true,
		opacity: 0.8,
		blending: THREE.AdditiveBlending
	});
	const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
	wireframe.scale.setScalar(1.015);
	scene.add(wireframe);

	const particleCount = 90;
	const positions = new Float32Array(particleCount * 3);
	for (let i = 0; i < particleCount; i++) {
		const radius = 2.1 + Math.random() * 0.6;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
		positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
		positions[i * 3 + 2] = radius * Math.cos(phi);
	}
	const particlesGeometry = new THREE.BufferGeometry();
	particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	const particlesMaterial = new THREE.PointsMaterial({
		color: 0xf0f4f8,
		size: 0.025,
		transparent: true,
		opacity: 0.6
	});
	const particles = new THREE.Points(particlesGeometry, particlesMaterial);
	scene.add(particles);

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const timer = new THREE.Timer();
	let frameId: number;

	function resize() {
		const { clientWidth, clientHeight } = canvas;
		camera.aspect = clientWidth / clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(clientWidth, clientHeight, false);
		if (prefersReducedMotion) renderer.render(scene, camera);
	}

	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);

	function tick() {
		timer.update();
		const delta = timer.getDelta();
		uniforms.uTime.value = timer.getElapsed();
		mesh.rotation.y += delta * 0.2;
		mesh.rotation.x += delta * 0.05;
		wireframe.rotation.copy(mesh.rotation);
		particles.rotation.y -= delta * 0.05;
		renderer.render(scene, camera);
		frameId = requestAnimationFrame(tick);
	}

	if (prefersReducedMotion) {
		renderer.render(scene, camera);
	} else {
		tick();
	}

	return function dispose() {
		if (!prefersReducedMotion) cancelAnimationFrame(frameId);
		resizeObserver.disconnect();
		geometry.dispose();
		material.dispose();
		wireframeGeometry.dispose();
		wireframeMaterial.dispose();
		particlesGeometry.dispose();
		particlesMaterial.dispose();
		renderer.dispose();
	};
}
