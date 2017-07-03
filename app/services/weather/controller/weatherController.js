'use strict';

import weatherTransformer from '../transformer/weatherTransformer';
import Util from 'app/global/api';
import axios from 'axios';
import winston from 'winston';

/** @Controller to get data from API and extract response and return to Router
 * Google API call being used to get LAT/LAN for city
 * darksky API call being made to get weather data after get lat/lan
 */

let weatherController = {
    /** @fetch
     * This function is being used to tranform the API response.
     * @param {function} returns callback
     * @returns {function} returns callback once weatherData is received from API
     */
       /* istanbul ignore next */
    fetch: (callback) => {
        winston.log('info', 'Running inside Controlller')
        return weatherController.apiRequest('')
            .then((response) => {
                let weatherData = response.data;
                callback(null, weatherTransformer.transform(weatherData));

            }).catch((error) => {
                callback(error, null);
            });
    },
    /** @fetchByCity
     * This function is being used to tranform the API response.
     * @param {function} returns callback
     * @param {String} city name to fetch Weather data
     * @returns {function} returns callback once weatherData is received from API
     */
       /* istanbul ignore next */
    fetchByCity: (city, callback) => {
        return weatherController.googleApiRequest(city)
            .then((response) => {
                weatherController.apiRequest(weatherController.extractLatLong(response.data))
                    .then((apiData) => {
                        let weatherData = apiData.data;
                        callback(null, weatherTransformer.transform(weatherData));
                    }).catch((error) => {
                        callback(error, null);
                    });
            }).catch((error) => {
                callback(error, null);
            });
    },
    /** @fetchByCityAndDay
     * This function is being used to return  the API response.
     * it process data for weekday today to get current data
     * @param {function} returns callback
     * @param {String} city name to fetch Weather data
     * @param {String} day  name to fetch Weather data based on weekday
     * @returns {function} returns callback once weatherData is received from API
     */
       /* istanbul ignore next */
    fetchByCityAndDay: (city, day, callback) => {
        if (day === 'today') {
            return weatherController.googleApiRequest(city)
                .then((response) => {
                    return weatherController.apiRequest(weatherController.extractLatLong(response.data))
                        .then((response) => {
                            let weatherData = response.data;
                            callback(null, weatherTransformer.transform(weatherData, 'today'));
                        }).catch((error) => {
                            callback(error, null);
                        });
                }).catch((error) => {
                    callback(error, null);
                });
        } else {
            return weatherController.googleApiRequest(city)
                .then((response) => {
                    return weatherController.apiRequest(weatherController.extractLatLong(response.data))
                        .then((response) => {
                            let weatherData = response.data;
                            callback(null, weatherTransformer.transform(weatherData, day));
                        }).catch((error) => {
                            callback(error, null);
                        });
                }).catch((error) => {
                    callback(error, null);
                });
        }
    },
    /** @apiRequest
     * This function is being used to return  a promise
     * @param {string}  response
     * @returns {object} returns promise object from axios call
     */
    apiRequest: (response) => {
        return axios.get(Util.buildUrl(response))
    },
    /** @googleApiRequest
     * this function is being used to ger Lat and lan for given city in API request
     * This function is being used to return  a promise
     * @param {string}  location
     * @returns {object} returns promise object from axios call to Google API
     */
    googleApiRequest: (location) => {
        return axios.get(Util.buildGoogleApiUrl(location))
    },
    /** @extractLatLong
     * This function is being used to return lat/lan
     * @param {String}  response
     * @returns {String} returns String
     */
    extractLatLong: (response) => {

        if (response.results !== null && response.results !== undefined) {
            winston.log('info', `${response.results[0].geometry.location.lng}`);
            return response.results[0].geometry.location.lat + "," + response.results[0].geometry.location.lng;
        }
    }

}
export default weatherController;
