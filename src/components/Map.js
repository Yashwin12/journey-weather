import React, { Component } from "react";
import { render } from "react-dom";
import * as myConstClass from "../commonUtils/Constants";
import APICall from "../commonUtils/APICall";

var directionsRenderer = null;
var directionsService = null;
class Map extends Component {
  constructor(props) {
    super(props);
    this.getDataFromDirectionsAPI = this.getDataFromDirectionsAPI.bind(this);
  }

  getDataFromDirectionsAPI() {
    // We should already have access to window.google obj over here as we're setting in LandingPage.js file.
    var uriParams = [
      {
        key: "origin",
        value: this.props.source,
      },
      {
        key: "destination",
        value: this.props.destination,
      },
      {
        key: "key",
        value: myConstClass.API_KEY,
      },
    ];
    var response = APICall(myConstClass.DIRECTIONS_GOOGLE_MAPS_JSON, uriParams);

    response.then((resp) => {
      console.log(resp);
      var startLat = resp.data.routes[0].legs[0].start_location.lat;
      var startLong = resp.data.routes[0].legs[0].start_location.lng;
      var endLat = resp.data.routes[0].legs[0].end_location.lat;
      var endLong = resp.data.routes[0].legs[0].end_location.lng;

      this.initMap(startLat, startLong, endLat, endLong);
    });
  }

  initMap(sourceLat, sourceLong, destLat, destLong) {
    var pointA = new window.google.maps.LatLng(sourceLat, sourceLong);
    var pointB = new window.google.maps.LatLng(destLat, destLong);

    window.map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.myOptions
    );

    // One needs to nullify directionsRenderer, as it would NOT AUTOMATICALLY clear previous routes from the map.
    if (directionsRenderer != null) {
      directionsRenderer.setMap(null);
      directionsRenderer = null;
    }

    // Instantiate a directions service.
    directionsService = new window.google.maps.DirectionsService();
    directionsRenderer = new window.google.maps.DirectionsRenderer();

    directionsRenderer.setMap(window.map);

    // get route from A to B
    this.calculateAndDisplayRoute( directionsService, directionsRenderer, pointA, pointB );
  }

  calculateAndDisplayRoute( directionsService, directionsRenderer, pointA, pointB ) {
    directionsService.route(
      {
        origin: pointA,
        destination: pointB,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      function (response, status) {
        if (status == "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }

  render() {
    return (
      <div style={{ width: "100%", height: "900px" }} id={this.props.id} >
        {this.getDataFromDirectionsAPI()}
      </div>
    );
  }
}

export default Map;
