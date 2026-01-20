import React from 'react';
import '../components/MapComponent.css';

import {APIProvider, Map ,AdvancedMarker,Pin} from '@vis.gl/react-google-maps';
export default function GoogleMap() {

  const MAP_ID= import.meta.env.VITE_MAP_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  return (

    <div className="w-full max-w-[1000px] h-[700px] mx-auto mt-10 rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <APIProvider apiKey={API_KEY}>
        <Map zoom={12}
          center={{lat: 53.54992, lng: 10.00678}}
          mapId={MAP_ID}>
          <AdvancedMarker position={{lat: 53.54992, lng: 10.00678}}>
            <Pin
              background={'#0f9d58'}
              borderColor={'#006425'}
              glyphColor={'#60d98f'}
            />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
