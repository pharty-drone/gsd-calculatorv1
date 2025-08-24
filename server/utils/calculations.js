export function calculateGSD({ sensorWidth, imageWidth, altitude, focalLength }) {
  if (!sensorWidth || !imageWidth || !altitude || !focalLength) {
    throw new Error('Missing parameters');
  }
  return (sensorWidth * altitude) / (focalLength * imageWidth) * 100;
}

export function computeActualOverlap({
  flightAltitude,
  roofHeight = 0,
  desiredFront,
  desiredSide,
}) {
  const adjustedAltitude = Math.max(1e-6, flightAltitude - roofHeight);
  const scale = adjustedAltitude / flightAltitude;
  const clamp = (v) => Math.min(0.99, Math.max(0, v));
  const actualFront = clamp(1 - (1 - desiredFront) / scale);
  const actualSide = clamp(1 - (1 - desiredSide) / scale);
  return { actualFront, actualSide };
}

export function recommendFixes({
  flightAltitude,
  roofHeight,
  desiredFront,
  desiredSide,
  actualFront,
  actualSide,
}) {
  const adjustedAltitude = Math.max(1e-6, flightAltitude - roofHeight);
  const frontRatio = desiredFront / Math.max(actualFront, 1e-6);
  const sideRatio = desiredSide / Math.max(actualSide, 1e-6);
  const scaleNeeded = Math.max(frontRatio, sideRatio, 1);
  let adjustedAltitudeNeeded = Math.min(
    flightAltitude,
    adjustedAltitude * scaleNeeded,
  );
  let recommendedFlightAltitude = roofHeight + adjustedAltitudeNeeded;
  recommendedFlightAltitude = Math.max(recommendedFlightAltitude, roofHeight + 1e-6);

  const buffer = 0.05;
  let recommendedFront = Math.max(desiredFront, Math.min(0.99, actualFront));
  let recommendedSide = Math.max(desiredSide, Math.min(0.99, actualSide));
  if (actualFront < desiredFront) {
    recommendedFront = Math.min(0.95, desiredFront + buffer);
  }
  if (actualSide < desiredSide) {
    recommendedSide = Math.min(0.95, desiredSide + buffer);
  }

  const altitudeNote =
    recommendedFlightAltitude > flightAltitude
      ? `Raise altitude to restore ${Math.round(desiredFront * 100)}/${Math.round(
          desiredSide * 100,
        )} at roof.`
      : 'Current altitude sufficient.';

  const overlapNote = 'Keep altitude; increase overlaps.';

  return {
    altitudeOption: { flightAltitude: recommendedFlightAltitude, note: altitudeNote },
    overlapOption: {
      front: recommendedFront,
      side: recommendedSide,
      note: overlapNote,
    },
  };
}
