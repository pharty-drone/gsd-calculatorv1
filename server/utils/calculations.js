export function calculateGSD({ sensorWidth, imageWidth, altitude, focalLength }) {
  if (!sensorWidth || !imageWidth || !altitude || !focalLength) {
    throw new Error('Missing parameters');
  }
  return (sensorWidth * altitude) / (focalLength * imageWidth) * 100;
}
