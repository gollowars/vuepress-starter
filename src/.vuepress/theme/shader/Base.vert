@import ./noise/noise2D;
// @import ./noise/noise3D;

uniform float time;
uniform float radius;
uniform float noise;
uniform float scrollStrength;
varying vec2 vUv;
// varying vec3 vPos;

void main(){
  vUv = uv;
  // vPos = position;

  float curlR = 1.;
  // float radius = 1.;
  float theta = position.x / radius;
  float tx = radius * sin(theta);
  float ty = position.y * cos(theta);
  float tz = radius - (cos(theta) * radius);

  float seed = time*0.3;
  // float testNoise = 0.3;
  float xnoise = -snoise(vec2(tx,ty)+seed)*(noise);
  float ynoise = snoise(vec2(ty,tz)+seed)*(noise);
  float znoise = snoise(vec2(tz,tx)+seed)*(noise);

  vec3 p = vec3(tx+xnoise, ty+ynoise, tz+znoise);

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
