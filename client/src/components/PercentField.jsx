import React from 'react';
import NumberField from './NumberField';

export default function PercentField(props) {
  return (
    <NumberField
      {...props}
      min={0}
      max={100}
      step={1}
      units="%"
    />
  );
}
