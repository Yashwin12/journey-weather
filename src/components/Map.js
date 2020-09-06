import React, { Component } from 'react';
import { render } from 'react-dom';
import * as myConstClass from "../commonUtils/Constants";

class Map extends Component {
  constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this)
  }

  onScriptLoad() {
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options);

    // Map is loaded now. Let'scriptEle create marker.
    this.props.onMapLoad(map)
  }

  componentDidMount() {
    if (!window.google) {
        var scriptEle = document.createElement('script');
        scriptEle.type = 'text/javascript';
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
      <div style={{ width: "100%", height: 700 }} id={this.props.id} />
    );
  }
}

export default Map