import {useEffect, useState} from 'react';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface Position{
	lat:number,
	lng:number
}

const Map = () => {
	
	const containerStyle = {
		height: "100vh",
		width: "100%",
	};
	
	const defaultPosition = {
		lat: 0,
		lng: 0,
	};

	const [currentPosition, setCurrentPosition] = useState<Position>(defaultPosition);
	
    useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			const currentPosition: Position = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			  };
			  setCurrentPosition(currentPosition);
			console.log(position.coords);
		  },
		  (err) => {
			console.log(err);
		  })
    }, []);

	const API_KEY = process.env.REACT_APP_MAP_API_KEY == null ? "" : process.env.REACT_APP_MAP_API_KEY;
	return (
		<LoadScript googleMapsApiKey={API_KEY}>
		  <GoogleMap
			mapContainerStyle={containerStyle}
			center={currentPosition}
			zoom={17}
		  >
	        <Marker
    	      title = { "現在地" }
        	  position = {currentPosition}
        	/>
		  </GoogleMap>
		</LoadScript>
	);
}
export default Map;