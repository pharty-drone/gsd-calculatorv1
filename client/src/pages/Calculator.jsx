import React, { useState } from 'react';
import { fetchGSD } from '../utils/api';
import Results from '../components/Results';
import { exportGsdPdf } from '../utils/pdf';
import FAQ from '../components/FAQ';
import TokenGate from '../components/TokenGate';
import { setToken } from '../utils/token';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // token-gate state
  const [showTokenGate, setShowTokenGate] = useState(false);
  const [pendingParams, setPendingParams] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const params = {
      ...DRONE_MODELS[model],
      flightAltitude: parseFloat(altitude),
      roofHeight: parseFloat(roofHeight),
      units,
    };

    try {
      const data = await fetchGSD(params);
      setResult(data);
    } catch (err) {
      // Show token modal only when backend returns 401 (Unauthorized)
      if (err?.message?.toLowerCase().includes('unauthorized')) {
        setPendingParams(params);
        setShowTokenGate(true);
      } else {
        setError(err.message || 'Failed to fetch results');
        setResult(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // When user enters a token, save it and retry the pending request
  const handleTokenSubmit = async (token) => {
    try {
      setToken(token);
      setShowTokenGate(false);
      if (pendingParams) {
        setLoading(true);
        const data = await fetchGSD(pendingParams);
        setResult(data);
        setPendingParams(null);
      }
    } catch (err) {
      setError(err.message || 'Failed after token entry');
    } finally {
      setLoading(false);
    }
  };

  const unitLabel = units === 'imperial' ? 'ft' : 'm';

  const handleExportPdf = async () => {
    if (!result) {
      alert('Please run a calculation first.');
      return;
    }
    alert('Preparing PDF...');
    const inputs = {
      model,
      altitude: parseFloat(altitude),
      roofHeight: parseFloat(roofHeight),
      units,
      ...DRONE_MODELS[model],
      desiredOverlap: result?.overlap?.desired,
    };
    const filename = await exportGsdPdf({ inputs, results: result });
    alert(`Downloaded ${filename}`);
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

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && !loading && !error && (
        <Results result={result} onExportPdf={handleExportPdf} />
      )}

      {/* Token prompt (only when backend rejects with 401) */}
      {showTokenGate && (
        <TokenGate
          visible={showTokenGate}
          onSubmit={handleTokenSubmit}
          onClose={() => setShowTokenGate(false)}
        />
      )}

      {/* Helpful docs for users */}
      <FAQ />
    </div>
  );
}
