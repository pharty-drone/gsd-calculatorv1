import React from 'react';
import PropTypes from 'prop-types';

function IconPixel() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 5.25h5.25v5.25H3.75V5.25zM3.75 13.5h5.25v5.25H3.75V13.5zM12 5.25h5.25v5.25H12V5.25zM12 13.5h5.25v5.25H12V13.5z"
      />
    </svg>
  );
}

function IconRoof() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l9.75-9.75L21.75 12M3.75 10.5v10.125A1.125 1.125 0 004.875 21.75h14.25a1.125 1.125 0 001.125-1.125V10.5"
      />
    </svg>
  );
}

function IconFootprint() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v10.5c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012.25 17.25V6.75z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 9.75l2.25 2.25-2.25 2.25m10.5-4.5l-2.25 2.25 2.25 2.25"
      />
    </svg>
  );
}

function IconOverlap() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3v7.5M3 3h7.5M3 3l7.5 7.5M21 21v-7.5M21 21h-7.5M21 21l-7.5-7.5M3 21h7.5M3 21v-7.5M3 21l7.5-7.5M21 3h-7.5M21 3v7.5M21 3l-7.5 7.5"
      />
    </svg>
  );
}

function ResultCard({ title, icon, children }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col">
      <div className="flex items-center mb-2 text-gray-900 dark:text-gray-100">
        <span className="text-primary">{icon}</span>
        <h3 className="ml-2 font-semibold">{title}</h3>
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-sm flex-1">{children}</div>
    </div>
  );
}

ResultCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default function Results({ result, onExport }) {
  const {
    groundGSD,
    roofGSD,
    footprintWidth,
    footprintHeight,
    gsdUnit,
    footprintUnit,
    overlap,
  } = result;

  const { altitudeOption, overlapOption } = overlap.recommendation;

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={onExport}
          className="px-4 py-2 bg-primary text-white rounded shadow"
        >
          Export PDF
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard title="Ground GSD" icon={<IconPixel />}>
          <p>
            {groundGSD} {gsdUnit}
          </p>
        </ResultCard>
        <ResultCard title="Roof GSD" icon={<IconRoof />}>
          <p>
            {roofGSD} {gsdUnit}
          </p>
        </ResultCard>
        <ResultCard title="Image Footprint" icon={<IconFootprint />}>
          <p>
            {footprintWidth} x {footprintHeight} {footprintUnit}
          </p>
        </ResultCard>
        <ResultCard title="Overlap Suggestion" icon={<IconOverlap />}>
          <div className="space-y-1">
            <p>
              Altitude: {altitudeOption.flightAltitude} {altitudeOption.units}
            </p>
            {altitudeOption.note && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {altitudeOption.note}
              </p>
            )}
            <p>
              Overlap: {overlapOption.front}/{overlapOption.side}
              {overlapOption.units}
            </p>
            {overlapOption.note && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {overlapOption.note}
              </p>
            )}
          </div>
        </ResultCard>
      </div>
    </div>
  );
}

Results.propTypes = {
  result: PropTypes.shape({
    groundGSD: PropTypes.number.isRequired,
    roofGSD: PropTypes.number.isRequired,
    footprintWidth: PropTypes.number.isRequired,
    footprintHeight: PropTypes.number.isRequired,
    gsdUnit: PropTypes.string.isRequired,
    footprintUnit: PropTypes.string.isRequired,
    overlap: PropTypes.shape({
      recommendation: PropTypes.shape({
        altitudeOption: PropTypes.shape({
          flightAltitude: PropTypes.number.isRequired,
          units: PropTypes.string.isRequired,
          note: PropTypes.string,
        }).isRequired,
        overlapOption: PropTypes.shape({
          front: PropTypes.number.isRequired,
          side: PropTypes.number.isRequired,
          units: PropTypes.string.isRequired,
          note: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  onExport: PropTypes.func,
};

Results.defaultProps = {
  onExport: () => {},
};

