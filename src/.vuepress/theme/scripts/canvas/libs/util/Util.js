export function map(num, toMin, toMax, fromMin, fromMax) {
  if (num <= fromMin) return toMin
  if(num >= fromMax) return toMax
  const p = (toMax - toMin) / (fromMax - fromMin)
  return ((num - fromMin)*p) + toMin
}
