export function calculateGsdMetrics({
  sensorWidth,
  focalLength,
  imageWidth,
  imageHeight,
  flightAltitude,
  roofHeight = 0,
  frontOverlap = 0.8,
  sideOverlap = 0.8,
  units = 'metric'
}) {
  const required = [sensorWidth, focalLength, imageWidth, imageHeight, flightAltitude];
  if (required.some((v) => typeof v !== 'number' || isNaN(v) || v <= 0)) {
    throw new Error('Missing or invalid parameters');
  }

  const isImperial = units === 'imperial';
  const toMeters = (v) => (isImperial ? v * 0.3048 : v);
  const altitudeMeters = toMeters(flightAltitude);
  const roofMeters = roofHeight > 0 ? toMeters(roofHeight) : 0;

  const groundGsdCm =
    (sensorWidth * altitudeMeters * 100) / (focalLength * imageWidth);

  let roofGsdCm = groundGsdCm;
  let effectiveFront = frontOverlap;
  let effectiveSide = sideOverlap;
  if (roofMeters > 0 && roofMeters < altitudeMeters) {
    const adjustedAltitude = altitudeMeters - roofMeters;
    roofGsdCm =
      (sensorWidth * adjustedAltitude * 100) / (focalLength * imageWidth);
    const scale = altitudeMeters / adjustedAltitude;
    effectiveFront = 1 - (1 - frontOverlap) * scale;
    effectiveSide = 1 - (1 - sideOverlap) * scale;
  }

  const footprintWidthMeters = (groundGsdCm * imageWidth) / 100;
  const footprintHeightMeters = (groundGsdCm * imageHeight) / 100;

  const convertLength = (v) => (isImperial ? v * 3.28084 : v);
  const convertGsd = (v) => (isImperial ? v / 2.54 : v);

  return {
    groundGSD: parseFloat(convertGsd(groundGsdCm).toFixed(3)),
    roofGSD: parseFloat(convertGsd(roofGsdCm).toFixed(3)),
    footprintWidth: parseFloat(convertLength(footprintWidthMeters).toFixed(3)),
    footprintHeight: parseFloat(convertLength(footprintHeightMeters).toFixed(3)),
    effectiveFrontOverlap: parseFloat(effectiveFront.toFixed(4)),
    effectiveSideOverlap: parseFloat(effectiveSide.toFixed(4)),
    gsdUnit: isImperial ? 'in/pixel' : 'cm/pixel',
    footprintUnit: isImperial ? 'feet' : 'meters'
  };
}

/*
Example usage:

// Metric example
console.log(
  calculateGsdMetrics({
    sensorWidth: 13.2,
    focalLength: 8.8,
    imageWidth: 4000,
    imageHeight: 3000,
    flightAltitude: 100,
    roofHeight: 20,
  })
);

// Imperial example (inputs in feet)
console.log(
  calculateGsdMetrics({
    sensorWidth: 13.2,
    focalLength: 8.8,
    imageWidth: 4000,
    imageHeight: 3000,
    flightAltitude: 328.084, // 100 m in feet
    roofHeight: 65.617, // 20 m in feet
    units: 'imperial'
  })
);
*/
