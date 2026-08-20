import React from 'react';

export default function IssueMap({ issues }) {
  // TODO for Map Contributor: Import Leaflet or Mapbox here
  // 'issues' is an array of objects containing lat, lng, title, priority, and status.

  return (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center shadow-inner">
      <div className="text-center text-gray-500">
        <p className="font-semibold">Interactive Map Area</p>
        <p className="text-sm">Expecting {issues ? issues.length : 0} pins to render.</p>
        <p className="text-xs mt-2 text-blue-500">
          Example pin: {issues && issues[0] && issues[0].coordinates ? `${issues[0].coordinates.lat}, ${issues[0].coordinates.lng}` : 'Waiting for data...'}
        </p>
      </div>
    </div>
  );
}
