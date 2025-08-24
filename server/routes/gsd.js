import { Router } from 'express';
import {
  calculateGSD,
  computeActualOverlap,
  recommendFixes,
} from '../utils/calculations.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const {
      sensorWidth,
      focalLength,
      imageWidth,
      imageHeight,
      flightAltitude,
      roofHeight = 0,
      units,
      desiredOverlap = {},
    } = req.query;

    const params = {
      sensorWidth: parseFloat(sensorWidth),
      focalLength: parseFloat(focalLength),
      imageWidth: parseFloat(imageWidth),
      imageHeight: parseFloat(imageHeight),
      flightAltitude: parseFloat(flightAltitude),
      roofHeight: roofHeight ? parseFloat(roofHeight) : 0,
      units: units && units.toLowerCase() === 'imperial' ? 'imperial' : 'metric',
    };

    const desiredFrontPct = desiredOverlap.front
      ? parseFloat(desiredOverlap.front)
      : 80;
    const desiredSidePct = desiredOverlap.side
      ? parseFloat(desiredOverlap.side)
      : 80;

    const required = [
      params.sensorWidth,
      params.focalLength,
      params.imageWidth,
      params.imageHeight,
      params.flightAltitude,
    ];

    if (required.some((v) => !Number.isFinite(v) || v <= 0)) {
      return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    if (!Number.isFinite(params.roofHeight) || params.roofHeight < 0) {
      return res.status(400).json({ error: 'Invalid roof height' });
    }

    if (
      !Number.isFinite(desiredFrontPct) ||
      !Number.isFinite(desiredSidePct) ||
      desiredFrontPct < 0 ||
      desiredSidePct < 0
    ) {
      return res.status(400).json({ error: 'Invalid desired overlap' });
    }

    if (params.roofHeight >= params.flightAltitude) {
      return res
        .status(400)
        .json({ error: 'roofHeight must be < flightAltitude' });
    }

    const desiredFront = desiredFrontPct / 100;
    const desiredSide = desiredSidePct / 100;

    const isImperial = params.units === 'imperial';
    const toMeters = (v) => (isImperial ? v * 0.3048 : v);
    const fromMeters = (v) => (isImperial ? v * 3.28084 : v);
    const convertGsd = (v) => (isImperial ? v / 2.54 : v);

    const altitudeMeters = toMeters(params.flightAltitude);
    const roofMeters = toMeters(params.roofHeight);

    const groundGsdCm = calculateGSD({
      sensorWidth: params.sensorWidth,
      imageWidth: params.imageWidth,
      altitude: altitudeMeters,
      focalLength: params.focalLength,
    });

    const roofGsdCm = calculateGSD({
      sensorWidth: params.sensorWidth,
      imageWidth: params.imageWidth,
      altitude: Math.max(1e-6, altitudeMeters - roofMeters),
      focalLength: params.focalLength,
    });

    const footprintWidthMeters = (groundGsdCm * params.imageWidth) / 100;
    const footprintHeightMeters = (groundGsdCm * params.imageHeight) / 100;

    const { actualFront, actualSide } = computeActualOverlap({
      flightAltitude: params.flightAltitude,
      roofHeight: params.roofHeight,
      desiredFront,
      desiredSide,
    });

    const { altitudeOption, overlapOption } = recommendFixes({
      flightAltitude: params.flightAltitude,
      roofHeight: params.roofHeight,
      desiredFront,
      desiredSide,
      actualFront,
      actualSide,
    });

    const response = {
      groundGSD: parseFloat(convertGsd(groundGsdCm).toFixed(3)),
      roofGSD: parseFloat(convertGsd(roofGsdCm).toFixed(3)),
      footprintWidth: parseFloat(fromMeters(footprintWidthMeters).toFixed(3)),
      footprintHeight: parseFloat(fromMeters(footprintHeightMeters).toFixed(3)),
      gsdUnit: isImperial ? 'in/pixel' : 'cm/pixel',
      footprintUnit: isImperial ? 'feet' : 'meters',
      overlap: {
        desired: {
          front: Math.round(desiredFront * 100),
          side: Math.round(desiredSide * 100),
        },
        actual: {
          front: Math.round(actualFront * 100),
          side: Math.round(actualSide * 100),
        },
        recommendation: {
          altitudeOption: {
            flightAltitude: parseFloat(
              altitudeOption.flightAltitude.toFixed(2),
            ),
            units: isImperial ? 'ft' : 'm',
            note: altitudeOption.note,
          },
          overlapOption: {
            front: Math.round(overlapOption.front * 100),
            side: Math.round(overlapOption.side * 100),
            units: '%',
            note: overlapOption.note,
          },
        },
      },
      units: params.units,
    };

    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
