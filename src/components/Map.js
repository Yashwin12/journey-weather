import React, { Component } from "react";
import { render } from "react-dom";
import * as myConstClass from "../commonUtils/Constants";
import APICall from "../commonUtils/APICall";
import { formatTime_unixToHHMM } from "../commonUtils/CommonUtilities";
import DirectionsComponent from "../components/DirectionsComponent";

var directionsRenderer = null;
var directionsService = null;
class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      directionsInHTMLFormat: []
    }
    this.getDataFromDirectionsAPI = this.getDataFromDirectionsAPI.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.value != nextState.value;
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
        value: myConstClass.GOOGLE_MAPS_API_KEY,
      },
    ];
    
    var response = APICall(myConstClass.DIRECTIONS_GOOGLE_MAPS_JSON, uriParams);

    response.then((resp) => {
      var startLat = resp.data.routes[0].legs[0].start_location.lat;
      var startLong = resp.data.routes[0].legs[0].start_location.lng;
      var endLat = resp.data.routes[0].legs[0].end_location.lat;
      var endLong = resp.data.routes[0].legs[0].end_location.lng;

      this.weatherForUniqueCities( resp.data.routes[0].legs[0].steps );

      this.setState ( { directionsInHTMLFormat: this.htmlDirections(resp.data.routes[0].legs[0].steps) });
      this.initMap(startLat, startLong, endLat, endLong);
    });
  }

  weatherForUniqueCities( stepsArray ){

    let uniqueCities = [];

    var today = new Date();
    var beginningOfTomorrow = new Date();
    beginningOfTomorrow.setDate(today.getDate() + 1);
    beginningOfTomorrow.setHours(0, 0, 0);
    var startTimeHuman = this.props.journeyStartTime;

    beginningOfTomorrow.setHours( startTimeHuman.substring(0, 2), startTimeHuman.substring(3, 5), 0);
    var startTimeUnix = (beginningOfTomorrow.getTime())/1000; // Converts startTime into UNIX timestamp
    var currentTime = startTimeUnix;
    console.log("1: ", currentTime);

    let boxDetails = [];
    
    var itemsProcessed = 0;
    stepsArray.forEach( (element) => {
        
        var uriParams = [
          {
            key: "lat",
            value: element.end_location.lat,
          },
          {
            key: "lon",
            value: element.end_location.lng,
          },
          {
            key: "appid",
            value: myConstClass.OPEN_WEATHER_MAP_API_KEY,
          },
        ];

        // Keeping this instead of application/json as to get around CORS error. 
        // Application/json will trigger a 'preflight' request, which needs a proxy server in-between for CORS header to be added. Hitting proxy cors-anywhere would result into 429 Status Code (Too Many Requests).
        var headersObj = {
          "Content-Type": "application/x-www-form-urlencoded"
        }
        
        var responseFromWeatherAPI  = APICall(myConstClass.OPEN_WEATHER_MAP_API_URI, uriParams, headersObj);
        responseFromWeatherAPI.then((respFromWeather) => {
          // console.log(respFromWeather);
          
          itemsProcessed++;

          if( !!respFromWeather && !!respFromWeather.data.city && !uniqueCities.includes(respFromWeather.data.city.name) ){
            // uniqueCities array doesn't contains this location, needs to be shown on the map.. 
            uniqueCities.push(respFromWeather.data.city.name);

            console.log("E: ", element.duration.value)
            currentTime = currentTime + element.duration.value; // This is from google maps for each leg in seconds 


            for ( var j = 0; j < respFromWeather.data.list.length; j++ ){
              var ele = respFromWeather.data.list[j];
              if( currentTime < ele.dt ){
                console.log(currentTime);
                boxDetails.push({
                  // startLat: element.start_location.lat,
                  // startLong: element.start_location.lng,
                  // endLat: element.end_location.lat,
                  // endLong: element.end_location.lng,
                  cityLat: respFromWeather.data.city.coord.lat,
                  cityLong: respFromWeather.data.city.coord.lon,
                  city: respFromWeather.data.city.name,
                  // time: currentTime,
                  time: formatTime_unixToHHMM(currentTime),
                  conditions: ele.weather[0].description,
                  // 300K × 9/5 - 459.67 = 80.33 °F
                  temperature: `${Math.round( (ele.main.temp - 273.15) * 9/5 + 32)}°F`,
                  // HACK: https://openweathermap.org/weather-conditions
                  weatherIcon : `https://openweathermap.org/img/wn/${ele.weather[0].icon}@2x.png` 
                });
                break;
              }
            }             

          }

          // The below loop is to check whether all the aysnc calls from weatherAPI are completed or not. After completion of ALL the weatherAPI calls it will go inside this if loop..
          if( itemsProcessed === stepsArray.length) {
            console.log("cities:", uniqueCities.length);
            console.log(boxDetails);
            console.log(this.state.directionsInHTMLFormat);

            this.setMarkers(window.map, boxDetails);
          }

        }); // end of Promise
 
    }); // end of stepsArray loop

  }

  setMarkers(map, details) {
    for (var h = 0; h < details.length; h++) {
        var forecastChoice = new window.google.maps.LatLng(details[h].cityLat, details[h].cityLong);
        var marker = new window.google.maps.Marker({
            position: forecastChoice,
            map: map,
            icon: details[h].weatherIcon,
            label: { color: '#00aaff', fontWeight: 'bold', fontSize: '14px', text: details[h].temperature },
            size: (20, 20),
        });
    }
  }

  htmlDirections( stepsArray ){

    let arrayToReturn = [];
    stepsArray.forEach( (element) => {
      arrayToReturn.push(element.html_instructions);
    });

    return arrayToReturn;
  }

  initMap(sourceLat, sourceLong, destLat, destLong) {
    var pointA = new window.google.maps.LatLng(sourceLat, sourceLong);
    var pointB = new window.google.maps.LatLng(destLat, destLong);

    window.map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.myOptions
    );

    // One needs to nullify directionsRenderer, as it would NOT AUTOMATICALLY clear previous routes from the map.
    // if (directionsRenderer != null) {
    //   directionsRenderer.setMap(null);
    //   directionsRenderer = null;
    // }

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

    let { directionsInHTMLFormat } = this.state;

    return (
      <div>
        <div style={{ width: "100%", height: "700px" }} id={this.props.id} >
          {this.getDataFromDirectionsAPI()}
        </div>
        { directionsInHTMLFormat.length > 0 ? <DirectionsComponent directionsInHTMLFormat = {directionsInHTMLFormat} /> : null }
      </div> 
    );
  }
}

export default Map;
