//@import ./noise/noise2D;

uniform sampler2D tDiffuse;
uniform sampler2D tMaskText;
uniform vec3 maskOverlayColor;
uniform vec3 maskTextColor;
uniform vec2 resolution;
uniform vec2 imageResolution;
uniform vec2 windowResolution;
uniform float bendPosition;
uniform float bendAmp;
uniform float textMaskMix;
uniform float maskOverlayValidateRectOffsetX;
uniform float time;
uniform float opacity;
uniform float scrollStrength;
uniform float waveNoise;
varying vec2 vUv;
// varying vec3 vPos;


vec2 getCoverUv(vec2 targetResolution){
  vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (targetResolution.x / targetResolution.y), 1.0),
        min((resolution.y / resolution.x) / (targetResolution.y / targetResolution.x), 1.0)
      );
  vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  return uv;
}

void main(void) {
  // DisplaceWave generate
  vec2 point = vUv.xy * resolution.xy;
  vec2 p = (point.xy * 2.0 - windowResolution) / min(windowResolution.x, windowResolution.y); // 正規化
  vec2 pos = (point.xy * 2.0 - resolution) / max(resolution.x, resolution.y); // 正規化
  float slantDistance = 2.0;
  p *= slantDistance;


  //////////////////////////v
  // slant
  // float slantPos = 0.0;
  // float actSlantPos = -2.* + 2.*4. * bendPosition;
  // float devideCnt = 100.;
  // float slantR = sin(-p.x + p.y + actSlantPos + time*1.0) / 1.;
  // float devideR = (floor(slantR * devideCnt) / devideCnt) * 3.0;
  // float slantG = sin(-p.x + p.y + actSlantPos + time*1.3) / 1.;
  // float devideG = (floor(slantG * devideCnt) / devideCnt) * 3.0;
  // float slantB = sin(-p.x + p.y + actSlantPos + time*1.6) / 1.;
  // float devideB = (floor(slantB * devideCnt) / devideCnt) * 3.0;
  // vec4 disp = vec4(vec3(devideR,devideG,slantB),1.0);

  //////////////////////////v
  // circle
  // p.y += -0.5;
  // p.x += 1.2;



  float circleScale = 0.5;
  float cR = 0.01 / 1. + (snoise(p+time*0.5))*0.3 * waveNoise;
  float cG = 0.01 / 1. + (snoise(p+time*0.6))*0.3 * waveNoise;
  float cB = 0.01 / 1. + (snoise(p+time*0.5))*0.3 * waveNoise;
  float circleScaleSpeed = 0.3;

  // float cR = 0.1 * ringWidthR / abs(1.-(length(p)/(circleScale+abs(sin(fract(time * circleScaleSpeed))))));
  // float cG = 0.1 * ringWidthG / abs(1.-(length(p)/(circleScale+abs(sin(fract(time * circleScaleSpeed*1.2))))));
  // float cB = 0.1 * ringWidthB / abs(1.-(length(p)/(circleScale+abs(sin(fract(time * circleScaleSpeed*2.4))))));

  // float circleR = circleScale * abs(sin(fract(time * circleScaleSpeed))) / length(p);
  // float circleG = circleScale * abs(sin(fract(time * circleScaleSpeed * 1.2))) / length(p);
  // float circleB = circleScale * abs(sin(fract(time * circleScaleSpeed + 1.5))) / length(p);
  vec4 disp = vec4(vec3(cR,cG,cB),1.0);
  // disp = vec4(vec3(1.),1.0);


  vec4 mask = disp;
  vec2 offset = vec2(mask.r, mask.g) * 10. * 0.01;


  // red rect for overlayMask effect amount
  vec4 redColor = vec4(1.,0.,0.,1.);
  vec4 blackColor = vec4(vec3(0.),1.0);

  // 1.0 ~ -1.0
  // float test = 0.0;
  float currentOffset = -(maskOverlayValidateRectOffsetX * 4.0 - 2.0);
  float showRange = floor(1.0 - floor(length(pos.x + currentOffset)));
  vec4 rect = vec4(vec3(showRange, 0.,0.),1.0);
  if(rect.r < 1.0){
    rect = blackColor;
  }
  vec4 overlayShow = rect;

  // calc diffuse uv
  vec2 coverUv = getCoverUv(imageResolution);
  float strength = 8.0 * 1.;
  vec4 dist = texture2D(tDiffuse, fract(coverUv - offset * vec2(0.1 * strength, strength * 0.01)));

  vec4 textDist = texture2D(tMaskText, fract(vUv - offset * vec2(0.1 * strength, strength * 0.01)));
  vec4 overlay = vec4(maskOverlayColor, 1.0);
  vec4 textColor = vec4(maskTextColor, 1.0);
  textDist = vec4(textDist.r + overlayShow.r,textDist.g + overlayShow.r,textDist.b + overlayShow.r,textDist.a);
  if(textDist.r == 0. && textDist.g == 0. && textDist.b == 0.) {
    dist = overlay;
  }else {
    dist = mix(textColor, dist, textMaskMix);
  }
  dist.a = opacity;

  gl_FragColor = dist;
  // gl_FragColor = overlayShow;
  // gl_FragColor = disp;
  // gl_FragColor = mask;
  // gl_FragColor = vec4(vec3(1.0 - length(p)), 1.0);
  // gl_FragColor = vec4(vec3(snoise(p)),1.0);



}
