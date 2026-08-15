import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function initChromeScenePBR(canvas: HTMLCanvasElement) {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
	camera.position.z = 4.5;

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;

	const pmremGenerator = new THREE.PMREMGenerator(renderer);
	const envRenderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
	scene.environment = envRenderTarget.texture;

	const material = new THREE.MeshPhysicalMaterial({
		color: new THREE.Color('#c8c8d4'),
		roughness: 0.05,
		metalness: 1.0,
		clearcoat: 1.0,
		reflectivity: 1.0,
		envMapIntensity: 2.5
	});
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

	// MeshPhysicalMaterial needs real lights to catch specular highlights on top of the env map.
	const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
	keyLight.position.set(3, 2, 4);
	scene.add(keyLight);
	const rimLight = new THREE.DirectionalLight(0x66156c, 3);
	rimLight.position.set(-4, -1, -2);
	scene.add(rimLight);

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
		const delta = timer.getDelta();
		mesh.rotation.y += delta * 0.2;
		mesh.rotation.x += delta * 0.05;
		wireframe.rotation.copy(mesh.rotation);
		renderer.render(scene, camera);
		frameId = requestAnimationFrame(tick);
	}
	tick();

	return function dispose() {
		cancelAnimationFrame(frameId);
		resizeObserver.disconnect();
		geometry.dispose();
		material.dispose();
		wireframeGeometry.dispose();
		wireframeMaterial.dispose();
		envRenderTarget.dispose();
		pmremGenerator.dispose();
		renderer.dispose();
	};
}
