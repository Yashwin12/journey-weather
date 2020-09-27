import React, { Component } from "react";

import Header from "../commonUtils/Header";
import Map from "../components/Map";


var directionsRenderer = null;
var directionsService = null;
class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientsPosition: { lat: 37.0902, lng: 95.7129 },  // Setting default to load at the center of USA.
      usersDestionationLocation: null,
      usersOriginLocation: null
    };
    this.buttonClick  = this.buttonClick.bind(this);
    
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

    // SetState is an ASYNC function. When the setState execution is completed then only renderDirections func should be called.
    this.setState( { usersOriginLocation, usersDestionationLocation }, () => {
      this.renderDirections( window.map );
    }); 
  }

  renderDirections( map = window.map ){
    
    let { usersOriginLocation, usersDestionationLocation } = this.state;

    if( (map != undefined || map != null) && ( !!usersDestionationLocation && !!usersOriginLocation) ){
       
      // One needs to nullify directionsRenderer, as it would NOT AUTOMATICALLY clear previous routes from the map. 
      if( directionsRenderer != null ){
        directionsRenderer.setMap(null);
        directionsRenderer = null;
      }
  
      directionsService = new window.google.maps.DirectionsService();
      directionsRenderer = new window.google.maps.DirectionsRenderer();
    
      directionsRenderer.setMap(map);
      this.calculateAndDisplayRoute(directionsService, directionsRenderer, usersOriginLocation, usersDestionationLocation);      
    }        
  }

  calculateAndDisplayRoute(directionsService, directionsRenderer, originLocation, destinationLocation) {
    directionsService.route(
      {
        origin: {
          // query: "Richmond"
          query: originLocation
        },
        destination: {
          // query: "Sacramento"
          query: destinationLocation
        },
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
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
                onClick={ this.buttonClick }
                className="btn btn-success col-xl-1 ml-5 mr-5"
                id="search-button"           
            >
                Let's go
            </button>        
        </form>

        <br/>

        {/* { this.state.usersOriginLocation != null &&
        this.state.usersDestionationLocation != null ? (
          <Map
            id="googleMap"
            options={{
              center: this.state.clientsPosition,
              zoom: 8,
            }}
            onMapLoad={(map) => {
              const marker = new window.google.maps.Marker({
                position: this.state.clientsPosition,
                map: map,
              });
            }}
            renderDirections={ this.renderDirections() }
          />
        ) : null} */}

       
          <Map
            id="googleMap"
            options={{
              center: this.state.clientsPosition,
              zoom: 8,
            }}
            onMapLoad={ (map) => {
              const marker = new window.google.maps.Marker({
                position: this.state.clientsPosition,
                map: map,
              });
            }}
            renderDirections = { ( map ) => {

              this.renderDirections(map);
            }}
          />        
       
      </div>
    );
  }
}

export default LandingPage;
