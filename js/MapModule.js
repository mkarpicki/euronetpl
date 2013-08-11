/**
 * Map View. View shows map and menu bar
 *
 * @param document - HTML Document Object
 * @param NS - {Object} namespace that module should live in
 * @param customEvent - object that delivers support for handling custom events
 * @param dataUtil - customized object with implemented methods for proper displaying data info*
 *
 * @requires HERE JavaScript API (http://developer.here.com)
 * @requires util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 *
 * @todo move nokia's objects as a dependencies
 * @todo if browser supports touch events - hide controls*
 */
(function (NS, domUtil, customEvent, dataUtil){

    /**
     * @param params {Object}
     * @param.container {DOM Object} - node that will be container for a map object
     */
    NS.MapModule = function (params) {

        var JUMP = 50,

            _firstPositionUsage = true,
            _node = params.node,
            _mapContainer = _node.getElementsByClassName("map-container")[0],
            _infoBubbles,

            _zoomLevelProp = "zoomLevel",

            _map,
            _userMarker,
            _userLayer,
            _resultsLayer,

            createMarker,
            initializeUserMarker,

            cleaSearchResults,
            renderMarkers,

            hide,
            show,
            zoomIn,
            zoomOut,

            initialize,
            initializeBubble,
            initializeCustomListeners,
            initializeMap,
            initializeMapControls,
            initializeLayers,

            markerClicked,

            userPositionRequired,
            updateUserMarker,

            updateMapPosition,
            updateMapZoomLevel,

            onModuleRequired,
            onGeoLocationFound,
            onItemDetailsRequired,

            onSearchItemsFound,
            onSearchItemsNotFound;

        /**
         * todo - test me
         * clears map from all rendered markers
         */
        cleaSearchResults = function () {
            _resultsLayer.objects.removeAll(_resultsLayer.objects.asArray());
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

                geoLocationFound: onGeoLocationFound,

                itemDetailsRequired: onItemDetailsRequired
            });
        };

        /**
         * creates and return map object
         * @return nokia.maps.map.Display
         */
        initializeMap = function (components) {
            return new nokia.maps.map.Display(_mapContainer, {

                // initial center and zoom level of the map
                center: [52.51, 13.4],
                components: components,
                zoomLevel: 10

            });
        };

        initializeBubble = function () {
            return new nokia.maps.map.component.InfoBubbles();
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

            _infoBubbles = initializeBubble();

            _map = initializeMap([_infoBubbles, new nokia.maps.map.component.Behavior()]);

            initializeLayers(_map);

            initializeMapControls(_map);

            initializeCustomListeners();

        };

        onItemDetailsRequired = function (event) {

            var item = event.params.item;

            customEvent.fire("moduleRequired", {
                moduleName: "map"
            });

            updateMapPosition(item.position);

            updateMapZoomLevel(16);

            _infoBubbles.openBubble(dataUtil.getDetailsInfo(item), {
                latitude: parseFloat(item.position.latitude),
                longitude: parseFloat(item.position.longitude)
            });

        };

        onModuleRequired = function (event) {

            if (event.params.moduleName === "map") {
                show();
            } else {
                hide();
            }

        };

        onSearchItemsFound = function (event) {

            cleaSearchResults();

            renderMarkers(event.params.items);
        };

        onSearchItemsNotFound = function () {
            cleaSearchResults();
        };

        onGeoLocationFound = function (event) {

            var coords = event.params.position.coords;

            if (_firstPositionUsage) {
                _firstPositionUsage = false;
                
                updateMapPosition(coords);
            }
            userPositionRequired(coords);
        };

        markerClicked = function (item) {
            customEvent.fire("itemDetailsRequired", {
                item: item
            });
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

                    marker.addListener("click", (function (item) {
                        return function () {
                            markerClicked(item);
                        };
                    }(item)));
                    
                    marker.addListener("tap", (function (item) {
                        return function () {
                            markerClicked(item);
                        };
                    }(item)));

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

        updateMapZoomLevel = function (level) {
            _map.set(_zoomLevelProp, parseInt(level, 10));
        };

        updateMapPosition = function (coords) {
            _map.set("center", {
                latitude: parseFloat(coords.latitude),
                longitude: parseFloat(coords.longitude)
            });
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

            _map.set(_zoomLevelProp, _map.get(_zoomLevelProp) + 1);

        };

        zoomOut = function () {

            _map.set(_zoomLevelProp, _map.get(_zoomLevelProp) - 1);

        };

        initialize();
    };

}(window, util.dom, util.customEvent, window.dataUtil));
