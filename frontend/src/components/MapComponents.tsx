import React from 'react';

import {APIProvider, Map} from '@vis.gl/react-google-maps';
export default function GoogleMap() {
  return (
    /* 1. ここに高さを入れないと、中身の地図は表示されません */
    <div style={{ height: '500px', width: '100%' }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: 35.0116574, lng: 135.768125 }}          onCameraChanged={(ev) =>
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
          }
        />
      </APIProvider>
    </div>
  );
}
