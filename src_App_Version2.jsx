// Example usage: src/App.jsx
import React from 'react';
import MultiTimezoneClock from './components/MultiTimezoneClock';

export default function App() {
  return (
    <div style={{ padding: 18 }}>
      <MultiTimezoneClock initialZones={['UTC', 'America/New_York', 'Europe/Berlin']} />
    </div>
  );
}