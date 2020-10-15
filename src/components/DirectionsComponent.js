import React, { Component } from "react";

class DirectionsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {

        let {directions} = this.props;
        console.log(directions);     
        return (
            <div>
                hello
            </div>
        );
    }
}

export default DirectionsComponent;