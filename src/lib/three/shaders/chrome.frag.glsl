uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
	vec3 viewDir = normalize(cameraPosition - vPosition);
	float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);

	float wave = sin(vPosition.x * 3.0 + uTime) * 0.5 + 0.5;
	vec3 chrome = mix(uColorA, uColorB, wave * fresnel);

	gl_FragColor = vec4(chrome, 1.0);
}
