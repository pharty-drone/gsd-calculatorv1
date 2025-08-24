import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function TokenGate({ visible, onSubmit, onClose }) {
  const [token, setTokenValue] = useState('');
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-80">
        <h2 className="text-lg mb-2">API Token Required</h2>
        <input
          type="text"
          value={token}
          onChange={(e) => setTokenValue(e.target.value)}
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700"
          placeholder="Enter token"
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(token)}
            className="px-3 py-1 bg-primary text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

TokenGate.propTypes = {
  visible: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
