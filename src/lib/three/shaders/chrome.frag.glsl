uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vNormal;
varying vec3 vWorldPosition;

float random(vec2 st) {
	return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
	vec3 viewDir = normalize(cameraPosition - vWorldPosition);
	float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);

	float waveA = sin(vWorldPosition.x * 3.0 + uTime * 0.6) * 0.5 + 0.5;
	float waveB = sin(vWorldPosition.y * 4.0 - uTime * 0.9) * 0.5 + 0.5;
	float wave = mix(waveA, waveB, 0.5);

	vec3 chrome = mix(uColorA, uColorB, clamp(wave * 0.6 + fresnel * 0.6, 0.0, 1.0));

	float grain = (random(gl_FragCoord.xy + uTime) - 0.5) * 0.06;
	chrome += grain;

	gl_FragColor = vec4(chrome, 1.0);
}
