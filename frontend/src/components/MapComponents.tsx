import React from 'react';

import {APIProvider, Map} from '@vis.gl/react-google-maps';
export default function GoogleMap() {
  return (
    /* h-[500px] のように単位付きで指定してください */
    /* mx-auto で中央寄せ、overflow-hidden で角丸を有効にします */
    <div className="w-full max-w-[1000px] h-[700px] mx-auto mt-10 rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: 35.0116574, lng: 135.768125 }}
          onCameraChanged={(ev) =>
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
          }
        />
      </APIProvider>
    </div>
  );
}
