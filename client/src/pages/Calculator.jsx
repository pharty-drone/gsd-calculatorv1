import React, { useState } from "react";
import { fetchGSD } from "../utils/api";
import { exportGsdPdf } from "../utils/pdf";
import Results from "../components/Results";
import AdvancedSettings from "../components/AdvancedSettings";
import FAQ from "../components/FAQ";
import TokenGate from "../components/TokenGate";
import { setToken } from "../utils/token";
import UnitToggle from "../components/UnitToggle";

const DRONE_MODELS = {
  "DJI Phantom 4 Pro": {
    sensorWidth: 13.2,
    imageWidth: 5472,
    imageHeight: 3648,
    focalLength: 8.8,
  },
  "DJI Mavic 3": {
    sensorWidth: 17.3,
    imageWidth: 5280,
    imageHeight: 3956,
    focalLength: 24,
  },
};

export default function Calculator() {
  const [model, setModel] = useState("DJI Phantom 4 Pro");
  const [altitude, setAltitude] = useState(100);
  const [roofHeight, setRoofHeight] = useState(0);
  const [units, setUnits] = useState("metric");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);

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
      if (err?.message?.toLowerCase().includes("unauthorized")) {
        setPendingParams(params);
        setShowTokenGate(true);
      } else {
        setError(err.message || "Failed to fetch results");
        setResult(null);
      }
    } finally {
      setLoading(false);
    }
  };

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
      setError(err.message || "Failed after token entry");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!result) {
      alert("Please run a calculation first.");
      return;
    }
    alert("Preparing PDF...");
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

  const unitLabel = units === "imperial" ? "ft" : "m";

  const modelSpecs = DRONE_MODELS[model];
  const sensorHeight = (modelSpecs.sensorWidth * modelSpecs.imageHeight) / modelSpecs.imageWidth;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: inputs and results */}
        <section className="lg:col-span-2 space-y-6">
          {/* Card: Input Parameters */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span className="i-tabler-adjustments text-xl" />
              <h2 className="font-semibold">Input Parameters</h2>
            </div>
            <div className="p-5">
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

                <UnitToggle units={units} onChange={setUnits} />

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Calculate
                  </button>
                  <AdvancedSettings />
                </div>
              </form>
            </div>
          </div>

          {/* Card: Results */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span className="i-tabler-chart-infographic text-xl" />
              <h2 className="font-semibold">Results</h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {result && !loading && !error && <Results result={result} />}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 min-h-64 flex items-center justify-center">
                <span className="text-slate-400">[Image Footprint Illustration]</span>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button
                className="px-3 py-2 rounded-lg border border-slate-300/70 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={handleExportPdf}
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* FAQ (collapsible) */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold">Help &amp; FAQ</h2>
              <button
                className="text-sm px-3 py-1 rounded-lg border border-slate-300/70 dark:border-slate-700"
                onClick={() => setShowFAQ((v) => !v)}
              >
                {showFAQ ? "Hide" : "Show"}
              </button>
            </div>
            {showFAQ && (
              <div className="px-5 pb-5">
                <FAQ />
              </div>
            )}
          </div>
        </section>

        {/* Right: camera specs panel */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm sticky top-4">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold">📷 Camera Specifications</h3>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <SpecRow label="Sensor Width" value={`${modelSpecs.sensorWidth} mm`} />
              <SpecRow label="Sensor Height" value={`${sensorHeight.toFixed(1)} mm`} />
              <SpecRow label="Focal Length" value={`${modelSpecs.focalLength} mm`} />
              <SpecRow label="Resolution" value={`${modelSpecs.imageWidth} × ${modelSpecs.imageHeight} px`} />
            </div>
          </div>
        </aside>
      </div>

      {showTokenGate && (
        <TokenGate
          visible={showTokenGate}
          onSubmit={handleTokenSubmit}
          onClose={() => setShowTokenGate(false)}
        />
      )}
    </>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
