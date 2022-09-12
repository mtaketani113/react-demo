import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Tab } from 'semantic-ui-react';

interface Position {
  lat: number;
  lng: number;
}

const Map = () => {
  const containerStyle = {
    height: '80vh',
    width: '100%',
  };

  const defaultPosition = {
    lat: 0,
    lng: 0,
  };

  const [currentPosition, setCurrentPosition] = useState<Position>(defaultPosition);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPosition: Position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentPosition(currentPosition);
        console.log(position.coords);
      },
      (err) => {
        console.log(err);
      },
    );
  }, []);

  const mainOffice = {
    lat: 35.6809591,
    lng: 139.7673068,
  };

  const branchOffice = {
    lat: 35.1706431,
    lng: 136.8816945,
  };

  const API_KEY =
    process.env.REACT_APP_MAP_API_KEY == null ? '' : process.env.REACT_APP_MAP_API_KEY;
  const panes = [
    {
      menuItem: '現在地',
      render: () => (
        <Tab.Pane>
          <GoogleMap mapContainerStyle={containerStyle} center={currentPosition} zoom={17}>
            <Marker title={'現在地'} position={currentPosition} />
          </GoogleMap>
        </Tab.Pane>
      ),
    },
    {
      menuItem: '本社',
      render: () => (
        <Tab.Pane>
          <GoogleMap mapContainerStyle={containerStyle} center={mainOffice} zoom={17}>
            <Marker title={'本社'} position={mainOffice} />
          </GoogleMap>
        </Tab.Pane>
      ),
    },
    {
      menuItem: '支店',
      render: () => (
        <Tab.Pane>
          <GoogleMap mapContainerStyle={containerStyle} center={branchOffice} zoom={17}>
            <Marker title={'支店'} position={branchOffice} />
          </GoogleMap>
        </Tab.Pane>
      ),
    },
  ];

  const TabExampleVerticalTabular = () => (
    <LoadScript googleMapsApiKey={API_KEY}>
      <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
    </LoadScript>
  );
  return (
    <div style={{ marginTop: '7em' }}>
      <TabExampleVerticalTabular />
    </div>
  );
};
export default Map;
