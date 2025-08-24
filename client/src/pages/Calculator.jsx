import React, { useState } from 'react';
import { fetchGSD } from '../utils/api';

const DRONE_MODELS = {
  'DJI Phantom 4 Pro': {
    sensorWidth: 13.2,
    imageWidth: 5472,
    imageHeight: 3648,
    focalLength: 8.8,
  },
  'DJI Mavic 3': {
    sensorWidth: 17.3,
    imageWidth: 5280,
    imageHeight: 3956,
    focalLength: 24,
  },
};

export default function Calculator() {
  const [model, setModel] = useState('DJI Phantom 4 Pro');
  const [altitude, setAltitude] = useState(100);
  const [roofHeight, setRoofHeight] = useState(0);
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = {
      ...DRONE_MODELS[model],
      flightAltitude: parseFloat(altitude),
      roofHeight: parseFloat(roofHeight),
      units,
    };
    const data = await fetchGSD(params);
    setResult(data);
  };

  const unitLabel = units === 'imperial' ? 'ft' : 'm';

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Drone Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            {Object.keys(DRONE_MODELS).map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Flight Altitude ({unitLabel})</label>
          <input
            type="number"
            value={altitude}
            onChange={(e) => setAltitude(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1">Roof Height ({unitLabel})</label>
          <input
            type="number"
            value={roofHeight}
            onChange={(e) => setRoofHeight(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1">Units</label>
          <select
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded">Calculate</button>
      </form>
      {result && (
        <div className="mt-4 space-y-2">
          <p>
            Ground GSD: {result.groundGSD} {result.gsdUnit}
          </p>
          <p>
            Roof GSD: {result.roofGSD} {result.gsdUnit}
          </p>
          <p>
            Effective Front Overlap:{' '}
            {(result.effectiveFrontOverlap * 100).toFixed(1)}%
          </p>
          <p>
            Effective Side Overlap:{' '}
            {(result.effectiveSideOverlap * 100).toFixed(1)}%
          </p>
          {result.frontOverlapLossPercent > 0 && (
            <p>Front Overlap Loss: {result.frontOverlapLossPercent.toFixed(1)}%</p>
          )}
          {result.sideOverlapLossPercent > 0 && (
            <p>Side Overlap Loss: {result.sideOverlapLossPercent.toFixed(1)}%</p>
          )}
          {result.recommendedAltitude && (
            <p>
              Recommended Altitude: {result.recommendedAltitude.toFixed(2)} {unitLabel}
            </p>
          )}
          <p>
            Recommended Front Overlap:{' '}
            {(result.recommendedFrontOverlap * 100).toFixed(1)}%
          </p>
          <p>
            Recommended Side Overlap:{' '}
            {(result.recommendedSideOverlap * 100).toFixed(1)}%
          </p>
          {result.warning && <p className="text-red-600">{result.warning}</p>}
        </div>
      )}
    </div>
  );
}
