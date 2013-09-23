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
 * @fixme - improve zoom / bbox handling and fix a bug for zoom in when img requested by bbox
 * @fixme - clean code
 */
(function (NS, domUtil, customEvent, dataUtil){

    /**
     * @param params {Object}
     * @param.container {DOM Object} - node that will be container for a map object
     */
    NS.MapModule = function (params) {

        //53.33952,15.0369599,13

        var _currentUserPosition = null,
            _firstPositionUsage = true,
            _node = params.node,
            _shown = false,

            //move to constructor and use those which are used by app
            _appId = params.hereConfig.appId || "DemoAppId01082013GAL",
            _appCode = params.hereConfig.authToken || "AJKnXv84fjrb0KIHawS0Tg",

            _default = {
                latitude: 53.33952,
                longitude: 15.0369,
                zoom: 10,
                nodot: true,
                pois: null,
                bbox: ""
            },

            _current = {
                latitude: _default.latitude,
                longitude: _default.longitude,
                width: _default.width,
                height: _default.height,
                zoom: _default.zoom,
                nodot: _default.nodot,
                pois: _default.pois,
                bbox: _default.bbox
            },

            _results = null,

            _service = "http://image.maps.cit.api.here.com/mia/1.6/mapview?app_id=" + _appId + "&app_code=" + _appCode,

            _images = {},

            renderMarkers,

            hide,
            show,
            zoomIn,
            zoomOut,

            initialize,
            initializeCustomListeners,

            getIndex,

            loadImage,
            loadDefaultImage,

            serializePois,

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

        serializePois = function (pois) {

            var serialized = "",
                item;

            if (pois && pois.length > 0) {
                for (var i = 0, len = pois.length; i < len; i++) {
                    
                    item = pois[i].latitude + "," + pois[i].longitude;
                    serialized += (serialized === "") ? item : "," + item ;
                }
            }

            return serialized;
        };

        getIndex = function (params, useBoundingBox) {

            var bbox = serializePois(params.bbox),

                index = "&lat=" + params.latitude +
                "&lon=" + params.longitude +
                "&w=" + _node.offsetWidth +
                "&h=" + _node.offsetHeight +
                "&nodot=" + params.nodot +
                "&poi=" + serializePois(params.pois);

            if (bbox && useBoundingBox) {
                index += "&bbox=" + bbox;
            } else {
                index += "&z=" + params.zoom;
            }

            return index;
        };

        loadImage = function (params, useBoundingBox) {

            var index = getIndex(params, useBoundingBox),
                img;

            if (!_images[index]) {

                img = document.createElement("img");
                img.setAttribute("src", _service + index);

                _images[index] = img;
            }

            _node.innerHTML = "";

            _node.appendChild(_images[index]);
        };

        loadDefaultImage = function () {

            loadImage(_default);
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
                searchForItemsFired: onSearchItemsNotFound,
                searchItemsFound: onSearchItemsFound,
                searchItemsNotFound: onSearchItemsNotFound,
                searchItemsFailed: onSearchItemsNotFound,
                geoLocationFound: onGeoLocationFound,
                itemDetailsRequired: onItemDetailsRequired
            });
        };

        /**
         * @constructor
         * sets configuration for library
         * creates map object.
         * @todo if there will be any different view / service depending on nokia lib move seeting of appclient to application js
         */
        initialize = function () {

            //that params are ugly here
            loadDefaultImage();

            initializeCustomListeners();

        };

        onItemDetailsRequired = function (event) {

            var params = event.params,
                item = params.item,
                itemPosition = params.itemPosition;

            _current.latitude = item.position.latitude;
            _current.longiude = item.position.longitude;

            _current.pois = [{
                latitude: item.position.latitude,
                longitude: item.position.longitude,
                text: itemPosition
            }];

            loadImage(_current);

        };

        onMapFocusRequired = function (event) {
            var zoomLevel = event.params.zoomLevel,
                position = event.params.position;

            updateMapCenter(position);

            updateMapZoomLevel(zoomLevel);

            loadImage(_current);
        };

        onModuleRequired = function (event) {

            if (event.params.moduleName === "map") {

                //loadImage(_current, true);
                //loadDefaultImage();
                if (_results) {
                    loadImage(_results, true);

                    _current = {
                        latitude: _results.latitude,
                        longitude: _results.longitude,
                        zoom: _results.zoom,
                        nodot: _results.nodot,
                        pois: _results.pois,
                        bbox: _results.bbox
                    };

                } else {
                    loadDefaultImage();
                }
                show();
            } else {
                hide();
            }

        };

        onSearchItemsFound = function (event) {

            var items = event.params.items || [],
                points = [];


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

            _results = null;

            if (points.length > 0) {

                _results = {
                    latitude: _current.latitude,
                    longitude: _current.longitude,
                    zoom: _current.zoom,
                    nodot: _current.nodot,
                    pois: _current.pois,
                    bbox: _current.bbox
                }
            }

            loadImage(_current, true);

        };

        onSearchItemsNotFound = function () {
            loadDefaultImage()
        };

        onGeoLocationFound = function (event) {

            var coords = event.params.position.coords;

            if (_firstPositionUsage) {
                _firstPositionUsage = false;

                updateMapCenter(coords);
            }
            userPositionRequired(coords);
        };

        renderMarkers = function (items) {

            var item,
                position;

            _current.pois = [];

            for (var i = 0, len = items.length; i < len; i++) {

                item = items[i];
                position = item.position;

                if (position) {

                    _current.pois.push({
                        latitude: position.latitude,
                        longitude: position.longitude,
                        text: i
                    });
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

        };

        updateMapZoomLevel = function (level) {
            _current.zoom = level;
        };

        /**
         *
         * @param coords
         */
        updateMapCenter = function (coords) {

            _current.latitude = coords.latitude;
            _current.longitude = coords.longitude;
        };

        zoomMapToItems = function (items) {

            var position;

            _current.bbox = [];

            if (items && items.length > 0) {
                for (var i = 0, len = items.length; i < len; i++) {

                    position = items[i].position;

                    _current.bbox.push({
                        latitude: position.latitude,
                        longitude: position.longitude
                    });
                    //point = items[i].latitude + "," + items[i].longitude;
                    //bbox += (bbox === "") ? point : "," + point;
                }
            }

        };

        /**
         * @param event
         */
        userPositionRequired = function (coords) {

        };

        zoomIn = function () {
            _current.zoom += 1;
            loadImage(_current);
        };

        zoomOut = function () {
            _current.zoom -= 1;
            loadImage(_current);
        };

        initialize();
    };

}(window, util.dom, util.customEvent, window.dataUtil));
