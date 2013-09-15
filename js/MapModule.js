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

            _currentUserPosition = null,
            _firstPositionUsage = true,
            _node = params.node,
            _mapContainer = _node.querySelectorAll(".map-container")[0],
            _infoBubbles,
            _shown = false,

            _zoomLevelProp = "zoomLevel",

            _map,
            _userMarker,
            _userLayer,
            _resultsLayer,

            createMarker,
            initializeUserMarker,

            clearSearchResults,
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

            updateMapCenter,
            updateMapZoomLevel,

            zoomMapToItems,

            onMapFocusRequired,
            onModuleRequired,
            onGeoLocationFound,
            onItemDetailsRequired,

            onSearchItemsFound,
            onSearchItemsNotFound;

        /**
         * clears map from all rendered markers
         */
        clearSearchResults = function () {
            var objects = _resultsLayer.objects;
            objects.removeAll(objects.asArray());
            _infoBubbles.closeAll();
        };

        createMarker = function (params) {
            var Marker = params.icon ? nokia.maps.map.Marker : nokia.maps.map.StandardMarker,
                anchor = params.anchor || {};

            return new Marker(
                new nokia.maps.geo.Coordinate(params.position.latitude, params.position.longitude),{
                text: params.text || "",
                visibility: params.visibility,
                icon: params.icon,
                // Offset the top left icon corner so that it's
                // Centered above the coordinate
                anchor: new nokia.maps.util.Point(anchor.left || 12, anchor.top || 32)
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
                mapFocusRequired: onMapFocusRequired,
                searchForItemsFired: clearSearchResults,
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

            var moveTop = _node.querySelectorAll(".move.top")[0],
                moveRight = _node.querySelectorAll(".move.right")[0],
                moveBottom = _node.querySelectorAll(".move.bottom")[0],
                moveLeft = _node.querySelectorAll(".move.left")[0],
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

            //that params are ugly here
            _map = initializeMap([_infoBubbles, new nokia.maps.map.component.Behavior()]);

            initializeLayers(_map);

            initializeMapControls(_map);

            initializeCustomListeners();

        };

        onItemDetailsRequired = function (event) {

            var item = event.params.item;

            _infoBubbles.openBubble(dataUtil.getDetailsInfo(item), item.position);

        };

        onMapFocusRequired = function (event) {
            var zoomLevel = event.params.zoomLevel,
                position = event.params.position;

            updateMapCenter(position);

            updateMapZoomLevel(zoomLevel);
        };

        onModuleRequired = function (event) {

            if (event.params.moduleName === "map") {
                show();
            } else {
                hide();
            }

        };

        onSearchItemsFound = function (event) {

            var items = event.params.items || [],
                points = [];

            clearSearchResults();

            //this is stupid
            //should call show
            //and show should fire event sayin "module opened" and all should listen to that instead of required
            //for hidding them self
            customEvent.fire("moduleRequired", {
                moduleName: "map"
            });

            renderMarkers(items);

            if (_currentUserPosition) {
                /**
                 * @reamde
                 * if users position set : join position with nearest results
                 * to have one array and position map to them
                 * Assumption: items are sorted already !!!
                 */
                items = items.slice(0,2);
                points = items.concat({
                    position: _currentUserPosition
                });
            } else {
                points = items;
            }

            zoomMapToItems(points);

        };

        onSearchItemsNotFound = function () {
            clearSearchResults();
        };

        onGeoLocationFound = function (event) {

            var coords = event.params.position.coords;

            if (_firstPositionUsage) {
                _firstPositionUsage = false;
                
                updateMapCenter(coords);
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
                marker,
                position;

            for (var i = 0, len = items.length; i < len; i++) {

                item = items[i];
                position = item.position;

                if (position) {

                    marker = createMarker({
                        position: {
                            latitude: position.latitude,
                            longitude: position.longitude
                        },
                        text: i + 1,
                        visibility: true
                    });

                    marker.addListener("click", (function (item) {
                        return function () {
                            markerClicked(item);
                            return false;
                        };
                    }(item)));
                    
                    marker.addListener("tap", (function (item) {
                        return function () {
                            markerClicked(item);
                            return false;
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
            _shown = false;
        };

        /**
         * Shoes view
         */
        show = function () {
            domUtil.showNode(_node);
            //customEvent.fire("mapModuleOpened");
            _shown = true;
        };

        updateUserMarker = function (coordinates) {
            _userMarker.set("coordinate", coordinates);
        };

        updateMapZoomLevel = function (level) {
            _map.set(_zoomLevelProp, parseInt(level, 10));
        };

        /**
         *
         * @param coords
         */
        updateMapCenter = function (coords) {
            _map.set("center", coords);

        };

        zoomMapToItems = function (items) {

            var points = [];

            for (var i = 0, len = items.length; i < len; i++) {
                points.push(items[i].position);
            }

            /**
             * todo - reomve me someday ?
             * @workaround
             * map is not setting proper zoom when not displayd (need to verify with api.here.com team)
             */
            setTimeout(function () {
                _map.zoomTo(nokia.maps.geo.BoundingBox.coverAll(points), false, "none");
            }, 500);

        };

        /**
         * @param event
         */
        userPositionRequired = function (coords) {

            if (!_userMarker) {
                _userMarker = initializeUserMarker(coords);
            }

            updateUserMarker(coords);

            _currentUserPosition = coords;
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
