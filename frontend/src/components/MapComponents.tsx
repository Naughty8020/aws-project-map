import React from 'react';
import '../components/MapComponent.css';
import {useCrowdData} from '../hooks/useCrowdData.ts';
import {APIProvider, Map ,AdvancedMarker,Pin} from '@vis.gl/react-google-maps';
import { Circle } from './Circle';
export default function GoogleMap() {

  const MAP_ID= import.meta.env.VITE_MAP_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';


  const getCrowdColor = (crowd:number) => {
    switch (true) {
    case crowd < 10:
      return '#00FF00'; // 緑
    case crowd < 20:
      return '#33FF00';
    case crowd < 30:
      return '#66FF00';
    case crowd < 40:
      return '#99FF00';
    case crowd < 50:
      return '#CCFF00';
    case crowd < 60:
      return '#FFFF00'; // 黄色
    case crowd < 70:
      return '#FFCC00';
    case crowd < 80:
      return '#FF9900';
    case crowd < 90: 
      default:
        return '#FF0000';
    }
  }
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
            radius={1000}
            options={{
              fillColor: getCrowdColor(spot.crowd),
              fillOpacity: spot.crowd / 100,
              strokeColor: getCrowdColor(spot.crowd),
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
