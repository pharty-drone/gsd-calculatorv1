import { Router } from 'express';
import { calculateGSD } from '../utils/calculations.js';
import { droneModels } from '../config/droneModels.js';

const router = Router();

router.get('/', (req, res) => {
  const { model, altitude } = req.query;
  const drone = droneModels.find((d) => d.model === model);
  if (!drone) {
    return res.status(400).json({ error: 'Unknown model' });
  }
  try {
    const gsd = calculateGSD({
      sensorWidth: drone.sensorWidth,
      imageWidth: drone.imageWidth,
      altitude: Number(altitude || 0),
      focalLength: drone.focalLength,
    });
    res.json({ gsd });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
