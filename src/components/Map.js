import React, { Component } from 'react';
import { render } from 'react-dom';
import * as myConstClass from "../commonUtils/Constants";

class Map extends Component {
  constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this)
  }

  onScriptLoad() {
        
    // Map should be assigned to a window object, as one can't access the map object in parent component.. 
    // https://stackoverflow.com/questions/10253265/get-google-maps-map-instance-from-a-htmlelement
    // const map = new window.google.maps.Map( document.getElementById(this.props.id), this.props.options);
    window.map = new window.google.maps.Map( document.getElementById(this.props.id), this.props.options);
    // Map is loaded now. Let's create marker.
    this.props.onMapLoad(window.map)

    this.props.renderDirections( window.map );

  }

  componentDidMount() {
    if (!window.google) {
        var scriptEle = document.createElement('script');
        scriptEle.type = 'text/javascript';
        // https://maps.googleapis.com/maps/api/directions/json?origin=77056&destination=77494&key=AIzaSyBliI96c0HBIH6n-C2OofgxK_CBhyVoC0k
        scriptEle.src = `https://maps.googleapis.com/maps/api/js?key=${myConstClass.API_KEY}`;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(scriptEle, x);
        //We cannot access google.maps until it'scriptEle finished loading, so adding EventListener.
        scriptEle.addEventListener('load', e => {
            this.onScriptLoad()
        })
    } else {
      this.onScriptLoad()
    }
  }

  render() {
// console.log("This is in map", this.props);
    return (
      <div style={{ width: "100%", height: "900px"}} id={this.props.id} />
    );
  }
}

export default Map