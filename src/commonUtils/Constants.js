// PROD deployment: For the deployment and additional security we would be adding secrets to the env. 
// HACK: https://stackoverflow.com/questions/53648652/how-to-use-environment-variables-in-github-page
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
export const OPEN_WEATHER_MAP_API_KEY = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;

// TODO: Comment above and add respective API keys to run locally.
// export const GOOGLE_MAPS_API_KEY = "";
// export const OPEN_WEATHER_MAP_API_KEY = "";

// This is to load google maps in the app... 
export const GOOGLE_MAPS_JS = "https://maps.googleapis.com/maps/api/js"

// cors-anywhere is a NodeJS reverse proxy which adds CORS headers to the proxied request. This is to get start and end location coordinates
export const DIRECTIONS_GOOGLE_MAPS_JSON = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json"

export const GOOGLE_MAPS_ID = "googleMap";

export const OPEN_WEATHER_MAP_API_URI = "https://api.openweathermap.org/data/2.5/forecast";