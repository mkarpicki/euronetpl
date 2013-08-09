/**
 * Map View. View shows map and menu bar
 *
 * @param document - HTML Document Object
 * @param NS - {Object} namespace that module should live in
 * @param customEvent - object that delivers support for handling custom events
 *
 * @requires HERE JavaScript API (http://developer.here.com)
 * @requires util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 *
 * @todo move nokia's objects as a dependencies
 * @todo if browser supports touch events - hide controls*
 */
(function (NS, domUtil, customEvent){

    /**
     * @param params {Object}
     * @param.container {DOM Object} - node that will be container for a map object
     */
    NS.MapModule = function (params) {

        var JUMP = 50,

            _firstPositionUsage = true,
            _node = params.node,
            _mapContainer = _node.getElementsByClassName("map-container")[0],

            _zoomLevelProp = "zoomLevel",
            _zoomLevelVal,

            _map,
            _userMarker,
            _userLayer,

            _resultsLayer,

            createMarker,
            initializeUserMarker,

            clearMap,
            renderMarkers,

            hide,
            show,
            zoomIn,
            zoomOut,

            initialize,
            initializeCustomListeners,
            initializeMap,
            initializeMapControls,
            initializeLayers,

            userPositionRequired,
            updateUserMarker,

            updateMapPosition,

            onModuleRequired,
            onGeoLocationFound,

            onSearchItemsFound,
            onSearchItemsNotFound;

        /**
         * clears map from all rendered markers
         */
        clearMap = function () {
            //console.log("mapview.clearmap");
        };

        createMarker = function (params) {
            var Marker = params.icon ? nokia.maps.map.Marker : nokia.maps.map.StandardMarker;

            return new Marker(
                new nokia.maps.geo.Coordinate(params.position.latitude, params.position.longitude),{
                text: params.text || "",
                visibility: params.visibility,
                icon: params.icon,
                // Offset the top left icon corner so that it's
                // Centered above the coordinate
                anchor: new nokia.maps.util.Point(params.anchor.left || 12, params.anchor.top || 32)
            });
        };

        /**
         * initializes custom event listeners
         */
        initializeCustomListeners = function () {
            customEvent.addListeners({

                moduleRequired: onModuleRequired,

                mapZoomInRequired: zoomIn,
                mapZoomOutRequired: zoomOut,

                searchItemsFound: onSearchItemsFound,
                searchItemsNotFound: onSearchItemsNotFound,
                searchItemsFailed: onSearchItemsNotFound,

                geoLocationFound: onGeoLocationFound
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

        initializeLayers = function (map) {
            _userLayer = new nokia.maps.map.Container();
            _resultsLayer = new nokia.maps.map.Container();

            map.objects.add(_userLayer);
            map.objects.add(_resultsLayer);
        };

        /**
         * @return map object
         */
        initializeUserMarker = function (position) {

            var marker,
                params = {
                    position: {
                        latitude: position.latitude,
                        longitude: position.longitude
                    },
                    visibility: true,
                    icon: "img/user-marker.png",
                    anchor: {
                        top: 16,
                        left: 16
                    }
                };

            marker = createMarker(params);

            _userLayer.objects.add(marker);

            return marker;
        };

        /**
         * @constructor
         * sets configuration for library
         * creates map object.
         * @todo if there will be any different view / service depending on nokia lib move seeting of appclient to application js
         */
        initialize = function () {

            _map = initializeMap();

            initializeLayers(_map);

            initializeMapControls(_map);

            initializeCustomListeners();

        };

        onModuleRequired = function (event) {

            if (event.params.moduleName === "map") {
                show();
            } else {
                hide();
            }

        };

        onSearchItemsFound = function (event) {
            //clear container
            var items = event.params.items;

            renderMarkers(event.params.items);
        };

        onSearchItemsNotFound = function () {
            //clear container
        };

        onGeoLocationFound = function (event) {

            var coords = event.params.position.coords;

            if (_firstPositionUsage) {
                _firstPositionUsage = false;
                
                updateMapPosition(coords);
            }
            userPositionRequired(coords);
        };

        renderMarkers = function (items) {

            var item,
                marker;

            for (var i = 0, len = items.length; i < len; i++) {

                item = items[i];

                if (item.position) {

                    //console.log(item);
                    marker = createMarker({
                        position: {
                            latitude: parseFloat(item.position.latitude),
                            longitude: parseFloat(item.position.longitude)
                        },
                        text: i + 1,
                        visibility: true,
                        //icon: "img/user-marker.png",
                        anchor: {
                            top: 16,
                            left: 16
                        }
                    });

                    _resultsLayer.objects.add(marker);
                }
            }
        };

        /**
         * hides view
         */
        hide = function () {
            domUtil.hideNode(_node);
        };

        /**
         * Shoes view
         */
        show = function () {
            domUtil.showNode(_node);
            //customEvent.fire("mapModuleOpened");
        };

        updateUserMarker = function (coordinates) {
            _userMarker.set("coordinate", coordinates)
        };

        updateMapPosition = function (coords) {
            _map.set("center", coords);
        };

        /**
         * @param event
         */
        userPositionRequired = function (coords) {

            if (!_userMarker) {
                _userMarker = initializeUserMarker(coords);
            }

            updateUserMarker(coords);
        };

        zoomIn = function () {

            _zoomLevelVal = _map.get(_zoomLevelProp);

            _map.set(_zoomLevelProp, _zoomLevelVal + 1);

        };

        zoomOut = function () {

            _zoomLevelVal = _map.get(_zoomLevelProp);

            _map.set(_zoomLevelProp, _zoomLevelVal - 1);

        };

        initialize();
    };

}(window, util.dom, util.customEvent));
