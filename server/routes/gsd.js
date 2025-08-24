import { Router } from 'express';
import { calculateGsdMetrics } from '../utils/gsdCalculator.js';
import { overlapThresholds } from '../config/settings.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const {
      sensorWidth,
      focalLength,
      imageWidth,
      imageHeight,
      flightAltitude,
      roofHeight,
      frontOverlap,
      sideOverlap,
      units,
    } = req.query;

    const params = {
      sensorWidth: parseFloat(sensorWidth),
      focalLength: parseFloat(focalLength),
      imageWidth: parseFloat(imageWidth),
      imageHeight: parseFloat(imageHeight),
      flightAltitude: parseFloat(flightAltitude),
      roofHeight: roofHeight ? parseFloat(roofHeight) : 0,
      frontOverlap: frontOverlap ? parseFloat(frontOverlap) : 0.8,
      sideOverlap: sideOverlap ? parseFloat(sideOverlap) : 0.8,
      units: units && units.toLowerCase() === 'imperial' ? 'imperial' : 'metric',
    };

    const required = [
      params.sensorWidth,
      params.focalLength,
      params.imageWidth,
      params.imageHeight,
      params.flightAltitude,
    ];

    if (required.some((v) => isNaN(v) || v <= 0)) {
      return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    if (params.roofHeight >= params.flightAltitude) {
      return res
        .status(400)
        .json({ error: 'Roof height must be less than flight altitude' });
    }

    const result = calculateGsdMetrics({ ...params, thresholds: overlapThresholds });
    res.json({ ...result, units: params.units });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
