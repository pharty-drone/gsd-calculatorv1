import { calculateGsdMetrics } from './gsdCalculator.js';

// Common parameters for a hypothetical camera
const common = {
  sensorWidth: 13.2,
  focalLength: 8.8,
  imageWidth: 4000,
  imageHeight: 3000,
  flightAltitude: 100,
  frontOverlap: 0.8,
  sideOverlap: 0.8,
};

console.log('Metric no roof:', calculateGsdMetrics(common));
console.log(
  'Metric roof 20m:',
  calculateGsdMetrics({ ...common, roofHeight: 20 })
);
console.log(
  'Imperial roof 65.6ft:',
  calculateGsdMetrics({
    ...common,
    flightAltitude: 328.084, // 100 m in feet
    roofHeight: 65.617, // 20 m in feet
    units: 'imperial',
  })
);
