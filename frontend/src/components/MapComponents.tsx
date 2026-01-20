import React from 'react';
import '../components/MapComponent.css';
import {useCrowdData} from '../hooks/useCrowdData.ts';
import {APIProvider, Map ,AdvancedMarker,Pin} from '@vis.gl/react-google-maps';
import { Circle } from './Circle';
export default function GoogleMap() {

  const MAP_ID= import.meta.env.VITE_MAP_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const {data, isLoading, error} = useCrowdData();
  console.log('Crowd Data:', data);
  return (

    <div className="w-full max-w-[1000px] h-[700px] mx-auto mt-10 rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <APIProvider apiKey={API_KEY}>
        <Map zoom={12}
center={{ lat: 35.6895, lng: 139.6917 }}
          mapId={MAP_ID}>
          {data?.map((spot) => (
          <Circle
            key={spot.name}
            center={{lat: spot.lat, lng: spot.lng}}
            radius={100}
            options={{
              fillColor: 'red',
              fillOpacity: spot.crowd / 100,
              strokeColor: 'red',
              strokeOpacity: 0.5,
              strokeWeight: 1,
            }}
          />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
