import React, { Component } from "react";

import Header from "../commonUtils/Header";
import Map from "../components/Map";
import * as myConstClass from "../commonUtils/Constants";

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
    this.onScriptLoad = this.onScriptLoad.bind(this);    
  }


  onScriptLoad() {
        
    var options = {
      center: this.state.clientsPosition,
      zoom: 8,
    }
    // Map should be assigned to a window object, as one can't access the map object directly.. 
    // HACK: https://stackoverflow.com/questions/10253265/get-google-maps-map-instance-from-a-htmlelement    
    // const map = new window.google.maps.Map( document.getElementById(this.props.id), this.props.options);
    window.map = new window.google.maps.Map( document.getElementById( myConstClass.GOOGLE_MAPS_ID ), options );
    // Map is loaded now. It can be accessed via window.google
  }

  componentDidMount() {
    this.clientCoordinates();

    if (!window.google) {
      var scriptEle = document.createElement("script");
      scriptEle.type = "text/javascript";
      scriptEle.src = `${myConstClass.GOOGLE_MAPS_JS}?key=${myConstClass.API_KEY}`;
      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(scriptEle, x);
      //We cannot access google.maps until it'scriptEle finished loading, so adding EventListener.
      scriptEle.addEventListener("load", (e) => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }

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

    // NOTE: SetState is an ASYNC function. 
    this.setState( { usersOriginLocation, usersDestionationLocation }); 
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

        { !!this.state.usersOriginLocation &&
        !!this.state.usersDestionationLocation ? (
          <Map
            id= {myConstClass.GOOGLE_MAPS_ID}
            source = {this.state.usersOriginLocation}
            destination = { this.state.usersDestionationLocation }        
          />
        ) : null}
       
      </div>
    );
  }
}

export default LandingPage;
