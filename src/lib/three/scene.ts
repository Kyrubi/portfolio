import * as THREE from 'three';
import vertexShader from './shaders/chrome.vert.glsl';
import fragmentShader from './shaders/chrome.frag.glsl';

export function initChromeScene(canvas: HTMLCanvasElement) {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
	camera.position.z = 4;

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);

	const uniforms = {
		uTime: { value: 0 },
		uColorA: { value: new THREE.Color('#c8c8d4') },
		uColorB: { value: new THREE.Color('#4a4e69') }
	};

	const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
	const geometry = new THREE.SphereGeometry(1.2, 128, 128);
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	const timer = new THREE.Timer();
	let frameId: number;

	function resize() {
		const { clientWidth, clientHeight } = canvas;
		camera.aspect = clientWidth / clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(clientWidth, clientHeight, false);
	}

	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);

	function tick() {
		timer.update();
		uniforms.uTime.value = timer.getElapsed();
		mesh.rotation.y += 0.002;
		renderer.render(scene, camera);
		frameId = requestAnimationFrame(tick);
	}
	tick();

	return function dispose() {
		cancelAnimationFrame(frameId);
		resizeObserver.disconnect();
		geometry.dispose();
		material.dispose();
		renderer.dispose();
	};
}
