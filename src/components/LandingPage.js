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

  buttonClick(){
    let usersOriginLocation = document.getElementById("usersOriginLocation").value;
    let usersDestionationLocation = document.getElementById("usersDestionationLocation").value;

    if( !usersDestionationLocation && !usersOriginLocation )
      return;

    // console.table( { usersOriginLocation, usersDestionationLocation} )

  }

  render() {
    return (
      <div>
        <Header title="Journey-weather" />
        <form className="form-inline container justify-content-center">
            <input
                type="text" 
                id="usersOriginLocation" 
                className="form-control col-xl-3 ml-5 mr-5"  // Using Bootstrap's util for spacing. 
                placeholder="Please enter Origin"
            />

            <input 
                type="text" 
                id="usersDestionationLocation" 
                className="form-control col-xl-3 ml-5 mr-5" 
                placeholder="Please enter destination"
            />
            <button
                type="button"
                onClick={ () => this.buttonClick() }
                className="btn btn-success col-xl-1 ml-5 mr-5"
                id="search-button"           
            >
                Let's go
            </button>        
        </form>

        <br/>
        <Map
          id="googleMap"
          options={{
            center: this.state.clientsPosition,
            zoom: 8,
          }}
          onMapLoad={ (map) => {
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
