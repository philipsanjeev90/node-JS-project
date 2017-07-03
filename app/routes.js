// Application routes

import WeatherServiceRoutes from 'app/services/weather/routes/weatherRoutes';
/**
 * HTTP {get} /weather Request Weather information
 * All express routes will prefixed with weather
 * @returns {object} weatherData fetched data of weather.
 */
let routes = function(app) {

    app.use('/weather', WeatherServiceRoutes);
}

export default routes;