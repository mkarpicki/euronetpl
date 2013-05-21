/**
 * Map View. View shows map and menu bar
 * @param params {Object}
 * params.container {DOM Object} - node that will be container for a map object
 * params.appId {String} HERE.com developer's account App ID
 * params.authToken {String} HERE.com developer's account App Token
 * @requires HERE JavaScript API (http://developer.here.com)
 * @requires util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 */
var MapView = function (params) {

    var JUMP = 50,

        _node = params.node,
        _mapContainer = _node.getElementsByClassName("map-container")[0],
        _appId = params.appId,
        _authToken = params.authToken,

        _zoomLevelProp = "zoomLevel",
        _zoomLevelVal,

        _map,

        clearMap,
        renderMarkers,

        hide,
        show,
        zoomIn,
        zoomOut,

        initialize,
        initializeBarControls,
        initializeCustomListeners,
        initializeMap,
        initializeMapControls;

    /**
     * clears map from all rendered markers
     */
    clearMap = function () {
        console.log("mapview.clearmap");
    };

    /**
     * initializes custom event listeners
     */
    initializeCustomListeners = function () {
        util.customEvent.addListeners({
            onSearchClicked: clearMap,
            onSearchFound: renderMarkers,
            zoomInBtnClick: zoomIn,
            zoomOutBtnClick: zoomOut
        });
    };

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

    /**
     * initializes an action onclick on each move control
     * @todo - depending on browser hide controls?
     * @param map
     */
    initializeMapControls = function (map) {

        var moveTop = _node.getElementsByClassName("move top")[0],
            moveRight = _node.getElementsByClassName("move right")[0],
            moveBottom = _node.getElementsByClassName("move bottom")[0],
            moveLeft = _node.getElementsByClassName("move left")[0],
            panType = "default";

        moveTop.onclick = function () {

            map.pan(0, 0 , 0, -JUMP, panType);
            return false;
        };

        moveRight.onclick = function () {

            map.pan(0, 0 , JUMP, 0, panType);
            return false;
        };  

        moveBottom.onclick = function () {

            map.pan(0, 0 , 0, JUMP, panType);
            return false;
        };

        moveLeft.onclick = function () {

            map.pan(0, 0 , -JUMP, 0, panType);
            return false;
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

        initializeCustomListeners();

    };

    renderMarkers = function (items) {
        console.log("Mapview.rendermarkers");
        console.log(items);
    };

    /**
     * hides view
     */
    hide = function () {
        _node.style.display = "none";
    };

    /**
     * Shoes view
     */
    show = function () {
        _node.style.display = "block";
    };

    zoomIn = function () {

        _zoomLevelVal = _map.get(_zoomLevelProp);

        _map.set(_zoomLevelProp, _zoomLevelVal + 1);

        console.log(_zoomLevelVal);
    };

    zoomOut = function () {

        _zoomLevelVal = _map.get(_zoomLevelProp);

        _map.set(_zoomLevelProp, _zoomLevelVal - 1);


        console.log(_zoomLevelVal);
    };
    
    initialize();
};