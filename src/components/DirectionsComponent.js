import React, { Component } from "react";
import {formatTime_unixToHHMM} from '../commonUtils/CommonUtilities';

class DirectionsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    renderDirections(){
        let htmlDirectionsArr = [];
        this.props.directionsInHTMLFormat.forEach( (element) => {
            htmlDirectionsArr.push(
                <tr>                
                    <td>{formatTime_unixToHHMM(element.unixTimeStamp)}</td>
                    <td dangerouslySetInnerHTML={{ __html: element.direction }} />
                </tr>
            );
        });
        return htmlDirectionsArr;
    }

    render() {
        
        return (
            <div>
                            
                <table className = "table table-striped">                
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Date(MM-DD) ~ Time</th>
                            <th scope="col">Direction</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {this.renderDirections()}
                    </tbody>                
                </table>
            </div>            
        );
    }
}

export default DirectionsComponent;