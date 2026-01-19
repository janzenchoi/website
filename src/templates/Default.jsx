import React from 'react';
import { outerContainerStyle, rowContainerStyle, columnContainerStyle } from '../helper/styles';

export const Default = () => {
  return (
    <div style={{ ...outerContainerStyle, ...rowContainerStyle }}>
      <div style={{ ...columnContainerStyle }}>
        Default Page
      </div>
    </div>
  );
}