uniform float uTime;
uniform vec3 uCyan;
uniform vec3 uViolet;
uniform vec3 uMagenta;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  float fresnel = pow(1.0 - abs(vNormal.z), 2.15);
  float wave = sin(vPosition.y * 4.0 + vPosition.x * 2.0 + uTime) * 0.5 + 0.5;
  vec3 spectrum = mix(uCyan, uViolet, wave);
  spectrum = mix(spectrum, uMagenta, fresnel * .72);
  gl_FragColor = vec4(spectrum, .23 + fresnel * .62);
}
