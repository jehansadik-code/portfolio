uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec3 displaced = position + normal * sin(position.y * 3.0 + uTime * 0.65) * 0.055;
  vPosition = displaced;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
