import React, { useState, useEffect } from 'react';
import droneModels from '../../../server/config/droneModels';
import NumberField from '../components/NumberField';
import PercentField from '../components/PercentField';
import UnitToggle from '../components/UnitToggle';

const defaultCamera = {
  sensorWidth: '',
  sensorHeight: '',
  focalLength: '',
  imageWidth: '',
  imageHeight: ''
};

const STORAGE_KEY = 'inputParams';

export default function Calculator() {
  const [model, setModel] = useState('DJI Phantom 4 Pro');
  const [units, setUnits] = useState('metric');
  const [altitude, setAltitude] = useState(0);
  const [cameraAngle, setCameraAngle] = useState(0);
  const [camera, setCamera] = useState(defaultCamera);
  const [roofHeight, setRoofHeight] = useState(0);
  const [overlapFront, setOverlapFront] = useState(80);
  const [overlapSide, setOverlapSide] = useState(80);
  const [showCamera, setShowCamera] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setModel(data.model || 'DJI Phantom 4 Pro');
        setUnits(data.units || 'metric');
        setAltitude(data.altitude ?? 0);
        setCameraAngle(data.cameraAngle ?? 0);
        setCamera(data.camera || defaultCamera);
        setRoofHeight(data.roofHeight ?? 0);
        setOverlapFront(data.overlapFront ?? 80);
        setOverlapSide(data.overlapSide ?? 80);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    const data = {
      model,
      units,
      altitude,
      cameraAngle,
      camera,
      roofHeight,
      overlapFront,
      overlapSide
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [model, units, altitude, cameraAngle, camera, roofHeight, overlapFront, overlapSide]);

  // Update camera specs when model changes
  useEffect(() => {
    if (model !== 'Custom') {
      const found = droneModels.find((d) => d.model === model);
      if (found) {
        setCamera(found.camera);
      }
    }
  }, [model]);

  const handleCameraChange = (field, value) => {
    setCamera((prev) => ({ ...prev, [field]: value }));
  };

  const altitudeMax = units === 'metric' ? 10000 : 32808; // ~10000m or 10km

  const isValid =
    altitude > roofHeight &&
    altitude >= 0 &&
    roofHeight >= 0 &&
    cameraAngle >= 0 &&
    cameraAngle <= 90 &&
    overlapFront >= 0 &&
    overlapFront <= 100 &&
    overlapSide >= 0 &&
    overlapSide <= 100 &&
    Object.values(camera).every((v) => v !== '' && v >= 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      model,
      units,
      altitude: Number(altitude),
      cameraAngleDeg: Number(cameraAngle),
      roofHeight: Number(roofHeight),
      desiredOverlap: { front: Number(overlapFront), side: Number(overlapSide) },
      camera: {
        sensorWidth: Number(camera.sensorWidth),
        sensorHeight: Number(camera.sensorHeight),
        focalLength: Number(camera.focalLength),
        imageWidth: Number(camera.imageWidth),
        imageHeight: Number(camera.imageHeight)
      }
    };
    console.log(JSON.stringify(payload, null, 2));
  };

  const modelOptions = [...droneModels.map((d) => d.model), 'Custom'];

  return (
    <div className="p-4 dark text-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Input Parameters</h2>
          <button
            type="submit"
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Submit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="model" className="text-sm font-medium text-gray-200">
              Drone Model
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            >
              {modelOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <UnitToggle units={units} onChange={setUnits} />

          <NumberField
            id="altitude"
            label="Flight Altitude"
            units={units === 'metric' ? 'm' : 'ft'}
            value={altitude}
            onChange={setAltitude}
            min={0}
            max={altitudeMax}
            describedby="altitudeHelp"
          />
          <p id="altitudeHelp" className="text-xs text-gray-400">
            Altitude must be greater than roof height.
          </p>

          <div className="flex flex-col gap-1">
            <label htmlFor="cameraAngle" className="text-sm font-medium text-gray-200">
              Camera Angle
              <span
                className="ml-1 text-xs cursor-help"
                title="0° is nadir, 90° is horizontal"
              >
                ⓘ
              </span>
            </label>
            <input
              id="cameraAngle"
              type="range"
              min="0"
              max="90"
              step="1"
              value={cameraAngle}
              onChange={(e) => setCameraAngle(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="text-sm">{cameraAngle}°</div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowCamera((s) => !s)}
            className="mt-2 w-full text-left font-medium"
          >
            Camera Specifications
          </button>
          {showCamera && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <NumberField
                id="sensorWidth"
                label="Sensor Width"
                units="mm"
                value={camera.sensorWidth}
                onChange={(v) => handleCameraChange('sensorWidth', v)}
                disabled={model !== 'Custom'}
              />
              <NumberField
                id="sensorHeight"
                label="Sensor Height"
                units="mm"
                value={camera.sensorHeight}
                onChange={(v) => handleCameraChange('sensorHeight', v)}
                disabled={model !== 'Custom'}
              />
              <NumberField
                id="focalLength"
                label="Focal Length"
                units="mm"
                value={camera.focalLength}
                onChange={(v) => handleCameraChange('focalLength', v)}
                disabled={model !== 'Custom'}
              />
              <NumberField
                id="imageWidth"
                label="Image Width"
                units="px"
                value={camera.imageWidth}
                onChange={(v) => handleCameraChange('imageWidth', v)}
                disabled={model !== 'Custom'}
              />
              <NumberField
                id="imageHeight"
                label="Image Height"
                units="px"
                value={camera.imageHeight}
                onChange={(v) => handleCameraChange('imageHeight', v)}
                disabled={model !== 'Custom'}
              />
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="mt-2 w-full text-left font-medium"
          >
            Advanced Options
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <NumberField
                id="roofHeight"
                label="Roof/Subject Height"
                units={units === 'metric' ? 'm' : 'ft'}
                value={roofHeight}
                onChange={setRoofHeight}
                min={0}
                max={altitudeMax}
                describedby="roofHelp"
                tooltip="Height of roof or subject above ground"
              />
              <p id="roofHelp" className="text-xs text-gray-400">
                Must be lower than altitude.
              </p>
              <PercentField
                id="overlapFront"
                label="Desired Overlap Front %"
                value={overlapFront}
                onChange={setOverlapFront}
                tooltip="Typical range 70-90%"
              />
              <PercentField
                id="overlapSide"
                label="Desired Overlap Side %"
                value={overlapSide}
                onChange={setOverlapSide}
                tooltip="Typical range 60-90%"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
