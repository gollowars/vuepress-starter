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

varying vec2 vUv;

void main(void) {

  vec4 mask = texture2D(tMask, vUv);


  vec2 ratio = vec2(
      min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
      min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
    );

  vec2 diffuseUv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

  vec4 diffuse = texture2D(tDiffuse, diffuseUv);

  if(showMask) {
    gl_FragColor = mask;
  } else {
    vec2 offset = vec2(mask.r, mask.g) * strength * 0.01;
    vec4 textMask = texture2D(tTextMask, fract(vUv + offset * vec2(offsetX * 0.01, offsetY * 0.01)));

    if(textMask.r >= 1.0) {
      gl_FragColor = diffuse*1.4;
    }else{
      float r = mix(diffuse.r,maskColor.r,1.0 - mask.r*0.4);
      float g = mix(diffuse.g,maskColor.g,1.0 - mask.b*0.4);
      float b = mix(diffuse.b,maskColor.b,1.0);
      gl_FragColor = vec4(r,g,b,1.0);
    }

      // gl_FragColor = texture2D(tDiffuse, fract(vUv - offset * vec2(offsetX * 0.01, offsetY * 0.01)));

  }

}
