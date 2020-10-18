import axios from "axios";

import {containsKey} from "./CommonUtilities.js";


function APICall ( baseURI = null , otherUriParams = [], headersObj = {} ) {

    if( baseURI !== null && baseURI !== "" && ( containsKey( "key", otherUriParams ) || containsKey( "appid", otherUriParams ))  === false ){
        console.info( "BaseURI && apiKey is not valid");        
        return;
    }

    let uriParams = "";    

    otherUriParams.forEach( ( element, index ) => {
        if( index === 0 )
            uriParams += "?" + element.key + "=" + element.value;
        
        else 
            uriParams += "&" + element.key + "=" + element.value;                
    });

    let finalUrl = `${baseURI}${uriParams}`

    // By default content-type would be application/json, if header is not present.
    if( !headersObj || Object.keys(headersObj).length === 0 ){
        headersObj = {'Content-Type': 'application/json'};
    }

    return new Promise( (resolve, reject) => {
        axios.get( finalUrl, {headers: headersObj })
        .then( (response) => {         
            resolve(response); 
        })
        .catch( (error) =>  {
            console.error(error);
            reject(error);         
        }); 
    });     
}

export default APICall;