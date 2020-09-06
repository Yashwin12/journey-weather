import React, { Component } from "react";

import Header from "../commonUtils/Header";
import Map from "../components/Map";

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientsPosition: { lat: 37.0902, lng: 95.7129 },  // Setting default to load at the center of USA.
    };
  }

  componentDidMount() {
    this.clientCoordinates();
  }

  clientCoordinates() {
    let clientsPosition = this.state.clientsPosition;
    
    if (navigator.geolocation) {
        // HACK: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
        navigator.geolocation.getCurrentPosition((position) => {
            clientsPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            this.setState({ clientsPosition });
        });
    }
  }

  render() {
    return (
      <div>
        <Header title="Journey-weather" />
        <Map
          id="googleMap"
          options={{
            center: this.state.clientsPosition,
            zoom: 8,
          }}
          onMapLoad={(map) => {
            const marker = new window.google.maps.Marker({
              position: this.state.clientsPosition,
              map: map            
            });
          }}
        />
      </div>
    );
  }
}

export default LandingPage;
