uniform sampler2D tTextMask;
uniform sampler2D tMask;
uniform sampler2D tDiffuse;
uniform float strength;
uniform float offsetX;
uniform float offsetY;
uniform bool showMask;
uniform bool useDiffuse;
uniform vec3 maskColor;
uniform vec2 resolution;
uniform vec2 imageResolution;

uniform float diffuseMaskMixAmount;
uniform float maskMixAmp;
uniform float diffuseLightenssAmp;
uniform float diffuseDisplaceAmount;
uniform float maskAlpha;
uniform float time;

varying vec2 vUv;




void main(void) {
  // DisplaceWave generate
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // 正規化

  float slantDistance = 2.5;
  p *= slantDistance;

  float devideCnt = 60.;

  float slantR = cos(p.x + p.y + (time * 2.)) / 2.;
  float devideR = floor(slantR * devideCnt) / devideCnt * 2.0;

  float slantG = sin(p.x + p.y + (time * 2.4)) / 2.;
  float devideG = floor(slantG * devideCnt) / devideCnt * 2.0;

  vec4 disp = vec4(vec3(devideR,devideG,0.0),1.0);


  // calc diffuse uv
  vec2 ratio = vec2(
      min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
      min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
    );
  vec2 diffuseUv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

  vec4 devideMask = texture2D(tMask, vUv);
  vec4 mask = disp;

  if(showMask) {
    gl_FragColor = disp;
  } else {
    vec2 offset = vec2(mask.r, mask.g) * strength * 0.01;
    vec4 textMask = texture2D(tTextMask, fract(vUv + offset * vec2(offsetX * 0.01, offsetY * 0.01)));

    vec4 diffuseDisplace = texture2D(tDiffuse, fract(diffuseUv - offset * vec2(offsetX * 0.01, offsetY * 0.01)));
    vec4 diffuse = texture2D(tDiffuse, diffuseUv);

    diffuse = mix(diffuse,diffuseDisplace, diffuseDisplaceAmount);

    float r = mix(diffuse.r,maskColor.r,(1.0 - mask.r*devideMask.r)*(1.0-devideMask.g));
    float g = mix(diffuse.g,maskColor.g,(1.0 - mask.b*devideMask.r)*(1.0-devideMask.g));
    float b = mix(diffuse.b,maskColor.b,(1.0)*(1.0-devideMask.g));
    vec4 mixDiffuse = vec4(r,g,b,1.0);


    vec4 dist = vec4(0,0,0,0);
    if(textMask.r >= 1.0) {
      diffuse *= 1.0 + (diffuseLightenssAmp*(1.0-devideMask.r)*(1.0 - devideMask.g));
      vec4 maskDist = mix(mixDiffuse, diffuse, devideMask.b);
      dist += maskDist;
    }else{
      dist += vec4(mixDiffuse.r,mixDiffuse.g,mixDiffuse.b,1.0);
    }


    gl_FragColor = dist;
  }

}
