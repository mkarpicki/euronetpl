/**
 * Map View. View shows map and menu bar
 * @param params {Object}
 * params.container {DOM Object} - node that will be container for a map object
 * params.appId {String} HERE.com developer's account App ID
 * params.authToken {String} HERE.com developer's account App Token
 * @requires HERE JavaScript API (http://developer.here.com)
 */
var MapView = function (params) {

    var JUMP = 50,
        _view = params.view,
        _mapContainer = _view.getElementsByClassName("map-container")[0],
        _appId = params.appId,
        _authToken = params.authToken,

        _map,

        initialize,
        initializeBarControls,
        initializeMap,
        initializeMapControls;

    /**
     * creates and return map object
     * @return nokia.maps.map.Display
     */
    initializeMap = function () {
        return new nokia.maps.map.Display(_mapContainer, {

            // initial center and zoom level of the map
            center: [52.51, 13.4],
            components: [
                new nokia.maps.map.component.Behavior()
            ],
            zoomLevel: 10

        });
    };

    initializeBarControls = function (map) {

        var bar = _view.getElementsByClassName("bar")[0],
            zoomIn = bar.getElementsByClassName("zoom-in-button")[0],
            zoomOut = bar.getElementsByClassName("zoom-out-button")[0],
            list = bar.getElementsByClassName("list-button")[0],
            search = bar.getElementsByClassName("search-button")[0],
            zoomLevelProp = "zoomLevel",
            zoomLevelVal;

        zoomIn.onclick = function () {

            zoomLevelVal = map.get(zoomLevelProp);

            map.set(zoomLevelProp, zoomLevelVal + 1);
        };

        zoomOut.onclick = function () {

            zoomLevelVal = map.get(zoomLevelProp);

            map.set(zoomLevelProp, zoomLevelVal - 1);
        };

        search.onclick = function () {
            customEvent.fire("searchIcoClick");
        };

        list.onclick = function () {
            customEvent.fire("listIcoClick");
        };
    };

    /**
     * initializes an action onclick on each move control
     * @todo - depending on browser hide controls?
     * @param map
     */
    initializeMapControls = function (map) {

        var moveTop = _view.getElementsByClassName("move top")[0],
            moveRight = _view.getElementsByClassName("move right")[0],
            moveBottom = _view.getElementsByClassName("move bottom")[0],
            moveLeft = _view.getElementsByClassName("move left")[0],
            panType = "default";

        moveTop.onclick = function () {

            map.pan(0, 0 , 0, -JUMP, panType);
        };

        moveRight.onclick = function () {

            map.pan(0, 0 , JUMP, 0, panType);
        };  

        moveBottom.onclick = function () {

            map.pan(0, 0 , 0, JUMP, panType);
        };

        moveLeft.onclick = function () {

            map.pan(0, 0 , -JUMP, 0, panType);
        };

    };

    /**
     * @constructor
     * sets configuration for library
     * creates map object.
     * @todo if there will be any different view / service depending on nokia lib move seeting of appclient to application js
     */
    initialize = function () {

        nokia.Settings.set("appId", _appId);
        nokia.Settings.set("authenticationToken", _authToken);

        _map = initializeMap();

        initializeMapControls(_map);

        initializeBarControls(_map);

    };
    
    initialize();
};