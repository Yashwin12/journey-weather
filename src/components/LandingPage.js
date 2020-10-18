import React, { Component } from "react";

import Header from "../commonUtils/Header";
import Map from "../components/Map";
import * as myConstClass from "../commonUtils/Constants";

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientsPosition: { lat: 37.0902, lng: 95.7129 },  // Setting default to load at the center of USA.
      usersDestionationLocation: null,
      usersOriginLocation: null,
      dateTimeObjectToUnix: null
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
      scriptEle.src = `${myConstClass.GOOGLE_MAPS_JS}?key=${myConstClass.GOOGLE_MAPS_API_KEY}`;
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
    let journeyStartTime = document.getElementById("journeyStartTime").value;
    let journeyStartDate = document.getElementById('journeyStartDate').options[document.getElementById('journeyStartDate').selectedIndex].text;
      
    if( !usersDestionationLocation && !usersOriginLocation && !!journeyStartTime && !!journeyStartDate )
      return;

    var dateTimeObjectToUnix = new Date(`${journeyStartDate}T${journeyStartTime}`).getTime()/1000;

    // NOTE: SetState is an ASYNC function. 
    this.setState( { usersOriginLocation, usersDestionationLocation, dateTimeObjectToUnix }); 
  }

  loadTimeOptions(){
    var today = new Date();
    var htmlOptionArr = [];

    var formatedDate = today.toISOString().substr(0,10);
    // Will push today's date first.. 
    htmlOptionArr.push(
      <option value={formatedDate}>{formatedDate}</option>
    );
    
    for ( var i = 1; i < 3; i++ ){
      today.setDate(today.getDate() + 1);
      formatedDate = today.toISOString().substr(0,10);

      htmlOptionArr.push(
        <option value={formatedDate}>{formatedDate}</option>
      );
    }
    return htmlOptionArr;
  }

  render() {
    return (
      <div>
        <Header title="Journey-weather" />
        <form className="form-inline container justify-content-center">
            <input
                type="text" 
                className="form-control col-xl-2 ml-2 mr-2"  // Using Bootstrap's util for spacing. 
                id="usersOriginLocation" 
                placeholder="Origin"
            />

            <input 
                type="text" 
                className="form-control col-xl-2 ml-2 mr-2" 
                id="usersDestionationLocation" 
                placeholder="Destination"
            />
            <select id="journeyStartDate" className="form-control col-xl-2 ml-2 mr-2">

              {this.loadTimeOptions()}
            </select>
            <input id = "journeyStartTime" className="form-control col-xl-2 ml-2 mr-2" type="time" step = "1800" required/>
                      
            <button
                type="button"
                className="btn btn-success col-xl-1 ml-2 mr-2"
                onClick={ this.buttonClick }
                id="search-button"           
            >
                Let's go
            </button> 
            
        </form>

        <br/>

        { !!this.state.usersOriginLocation &&
        !!this.state.usersDestionationLocation && !!this.state.dateTimeObjectToUnix ? (
          <Map
            id= {myConstClass.GOOGLE_MAPS_ID}
            source = {this.state.usersOriginLocation}
            destination = { this.state.usersDestionationLocation }        
            dateTimeObjectToUnix = {this.state.dateTimeObjectToUnix }
          />
        ) : null}
       
      </div>
    );
  }
}

export default LandingPage;
