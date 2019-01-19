//@import ../noise/noise2D;

uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform vec2 imageResolution;
uniform float bendPosition;
uniform float bendAmp;
uniform float time;
uniform float opacity;
uniform float transiteOffsetX;
varying vec2 vUv;
// varying vec3 vPos;
uniform float waveNoise;


vec2 getCoverUv(vec2 targetResolution){
  vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (targetResolution.x / targetResolution.y), 1.0),
        min((resolution.y / resolution.x) / (targetResolution.y / targetResolution.x), 1.0)
      );
  ratio = ratio * 0.9 - 0.0*transiteOffsetX;
  vec2 uv = vec2(
      (vUv.x * ratio.x + (1.0 - ratio.x) * 0.5) -0.08 + 0.16*transiteOffsetX,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  return uv;
}

void main(void) {
  // DisplaceWave generate
  vec2 point = vUv.xy * resolution.xy;
  vec2 p = (point.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // 正規化

  float slantDistance = 6.0;
  p *= slantDistance;


  float slantPos = 0.0;
  float actSlantPos = -2.* + 2.*4. * bendPosition;
  // cos(angle * Math.PI / 180) * r *

  float yurayuraSpeed = 3.0;
  float devideCnt = 60.;

  float slantR = sin(-p.x + p.y + actSlantPos + time*1.2) / 2.;
  float devideR = floor(slantR * devideCnt) / devideCnt * 1.0;

  float slantG = sin(-p.x + p.y + actSlantPos + time*1.2) / 2.;
  float devideG = floor(slantG * devideCnt) / devideCnt * 1.0;

  float slantB = sin(-p.x + p.y + actSlantPos + time*1.2) / 2.;
  float devideB = floor(slantB * devideCnt) / devideCnt * 1.0;

  // float circleScale = 0.5;
  // float cR = 0.01 / 1. + (snoise(p/5.0+time*1.0))*0.3 * waveNoise;
  // float cG = 0.01 / 1. + (snoise(p/5.0+time*2.0))*0.3 * waveNoise;
  // float cB = 0.01 / 1. + (snoise(p/5.0+time*3.0))*0.3 * waveNoise;
  // float circleScaleSpeed = 0.3;

  vec4 disp = vec4(vec3(devideR,devideG,slantB),1.0);
  // vec4 disp = vec4(vec3(cR,cG,cB),1.0);

  vec4 mask = disp;
  vec2 offset = vec2(mask.r, mask.g) * 10. * 0.01;


  // calc diffuse uv
  vec2 coverUv = getCoverUv(imageResolution);
  float strength = 8.0 * bendAmp;
  // vec4 dist = texture2D(tDiffuse, coverUv);
  vec4 dist = texture2D(tDiffuse, fract(coverUv - offset * vec2(0.1 * strength, strength * 0.01)));


  dist = dist;
  dist.a = opacity;
  gl_FragColor = dist;
  // gl_FragColor = disp;
  // gl_FragColor = mask;
  // gl_FragColor = vec4(vec3(1.0 - length(p)), 1.0);
  // gl_FragColor = vec4(vec3(snoise(p)),1.0);



}
