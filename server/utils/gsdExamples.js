import { computeActualOverlap, recommendFixes } from './calculations.js';

const desired = { front: 0.8, side: 0.8 };

// Metric example
const metricActual = computeActualOverlap({
  flightAltitude: 100,
  roofHeight: 20,
  desiredFront: desired.front,
  desiredSide: desired.side,
});
const metricFixes = recommendFixes({
  flightAltitude: 100,
  roofHeight: 20,
  desiredFront: desired.front,
  desiredSide: desired.side,
  actualFront: metricActual.actualFront,
  actualSide: metricActual.actualSide,
});
console.log('Metric 80/80 -> actual overlap', metricActual);
console.log('Metric recommendations', metricFixes);

// Imperial parity check
const imperialActual = computeActualOverlap({
  flightAltitude: 328.084, // 100 m in feet
  roofHeight: 65.617, // 20 m in feet
  desiredFront: desired.front,
  desiredSide: desired.side,
});
console.log('Imperial 80/80 -> actual overlap', imperialActual);
