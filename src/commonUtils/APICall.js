import axios from "axios";

import {containsKey} from "./CommonUtilities.js";

function APICall ( baseURI = null , otherUriParams = [] ) {

    if( baseURI !== null && baseURI !== "" && containsKey( "key", otherUriParams ) === false ){
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

    return new Promise( (resolve, reject) => {
        // axios.defaults.headers.get['']
        axios.get(  finalUrl, { headers:{"Access-Control-Allow-Origin": "*"} })
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