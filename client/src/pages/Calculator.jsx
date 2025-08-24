import React, { useState } from 'react';
import { fetchGSD } from '../utils/api';

export default function Calculator() {
  const [model, setModel] = useState('DJI Phantom 4 Pro');
  const [altitude, setAltitude] = useState(100);
  const [gsd, setGSD] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetchGSD({ model, altitude });
    setGSD(data.gsd);
  };

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
            <option>DJI Phantom 4 Pro</option>
            <option>DJI Mavic 3</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Altitude (m)</label>
          <input
            type="number"
            value={altitude}
            onChange={(e) => setAltitude(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded">Calculate</button>
      </form>
      {gsd && <p className="mt-4">GSD: {gsd.toFixed(2)} cm/pixel</p>}
    </div>
  );
}
