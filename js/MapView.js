/**
 * Map View. View shows map and menu bar
 * @param params {Object}
 * params.container {DOM Object} - node that will be container for a map object
 * params.appId {String} HERE.com developer's account App ID
 * params.authToken {String} HERE.com developer's account App Token
 * @requires HERE JavaScript API (http://developer.here.com)
 */
var MapView = function (params) {

    var _view = params.view,
        _mapContainer = _view.getElementsByClassName("map-container")[0],
        _appId = params.appId,
        _authToken = params.authToken,

        _map,

        initialize;


    /**
     * @constructor
     * sets configuration for library
     * creates map object.
     */
    initialize = function () {
        nokia.Settings.set("appId", _appId);
        nokia.Settings.set("authenticationToken", _authToken);

        _map = new nokia.maps.map.Display(_mapContainer, {
            // initial center and zoom level of the map
            center: [52.51, 13.4],
            zoomLevel: 10

        });
    };
    
    initialize();
};