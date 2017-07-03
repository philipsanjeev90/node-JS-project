import chai from 'chai';
import server from '../../server';
import {
    addPath
} from 'app-module-path';
addPath(__dirname);
import weatherController from '../../app/services/weather/controller/weatherController';
var expect = chai.expect;


describe('Test case Extract Lat/lng', function() {
    it("weather API call to return json object", function(done) {

        let testData = {
            "results": [{
                "address_components": [{
                        "long_name": "Delhi",
                        "short_name": "DL",
                        "types": ["administrative_area_level_1", "political"]
                    },
                    {
                        "long_name": "India",
                        "short_name": "IN",
                        "types": ["country", "political"]
                    }
                ],
                "formatted_address": "Delhi, India",
                "geometry": {
                    "bounds": {
                        "northeast": {
                            "lat": 28.881338,
                            "lng": 77.34845780000001
                        },
                        "southwest": {
                            "lat": 28.412593,
                            "lng": 76.83806899999999
                        }
                    },
                    "location": {
                        "lat": 28.7040592,
                        "lng": 77.10249019999999
                    },
                    "location_type": "APPROXIMATE",
                    "viewport": {
                        "northeast": {
                            "lat": 28.881338,
                            "lng": 77.34845780000001
                        },
                        "southwest": {
                            "lat": 28.412593,
                            "lng": 76.83806899999999
                        }
                    }
                },
                "place_id": "ChIJLbZ-NFv9DDkRQJY4FbcFcgM",
                "types": ["administrative_area_level_1", "political"]
            }],
            "status": "OK"
        }
        var testPromise = new Promise(function(resolve, reject) {
            // test with dummy location
            setTimeout(function() {
                resolve(weatherController.extractLatLong(testData));
            }, 200);
        });
        testPromise.then(function(result) {
            try {
                expect(result).to.not.be.undefined;
                expect(result).to.equal('28.7040592,77.10249019999999');
                done();
            } catch (err) {
                done(err);
            }
        }, done);
    });
})

describe('Test case for App Transformer with empty Array', function() {
    it("Google API call Test for getting Lat/Lan", function(done) {
        var testPromise = new Promise(function(resolve, reject) {
            weatherController.googleApiRequest('delhi').then(function(data) {
                resolve(data)
            }, function(err) {
                reject(err)
            })
        });
        testPromise.then(function(result) {
            try {
                expect(result.status).to.equal(200);
                expect(result).to.not.be.undefined;
                expect(result.data.results[0].geometry.location.lat).to.equal(28.7040592);
                expect(result.data.results[0].geometry.location.lng).to.equal(77.10249019999999);
                done();
            } catch (err) {
                done(err);
            }
        }, done);
    });
})

describe('Test case for Weather API sending JSON object', function() {
    it("weather API call to return json object", function(done) {
        var testPromise = new Promise(function(resolve, reject) {
            // test with dummy location
            weatherController.apiRequest('28.7040592,77.10249019999999')
                .then(function(data) {
                resolve(data)
            }, function(err) {
                reject(err)
            })
        });
        testPromise.then(function(result) {
            try {
                expect(result).to.not.be.undefined;
                expect(result.status).to.equal(200);
                done();
            } catch (err) {
                done(err);
            }
        }, done);
    });
})






describe('Test case for Weather API/Google API Together Nested', function() {
    it("Google API call to return json object to Weather API", function(done) {
        var testPromise = new Promise(function(resolve, reject) {
            // test with dummy location
            weatherController.googleApiRequest('delhi').then(function(response) {
                weatherController.apiRequest(weatherController.extractLatLong(response.data)).then(function(data) {
                    resolve(data)
                }, function(err) {
                    reject(err)
                })
            }, function(err) {
                reject(err)
            })
        });
        testPromise.then(function(result) {
            try {
                expect(result).to.not.be.undefined;
                expect(result.status).to.equal(200);

                done();
            } catch (err) {
                done(err);
            }
        }, done);
    });
})
