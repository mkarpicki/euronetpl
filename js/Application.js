/**
 * Main Application Class
 *
 * @param params
 * param.serviceUrl {String} - url that points to service which wil provide JSONP with results
 *
 * @require global object common.karpicki.com/front/util/customEvent
 * @require global object common.karpicki.com/front/util/browser
 * @require global service common.karpicki.com/front/service/mobileGeoLocation.js
 * @require message object
 */
(function (document, NS, util, service) {

    var _customEvent = util.customEvent,
        _geoLocation = service.geoLocation,
        _message = NS.message;

    NS.Application = function (params) {

        var _serviceUrl = params.serviceUrl,
            _appId = params.hereCom.appId,
            _authToken = params.hereCom.authToken,
            _lang = params.lang || "en-GB",

            init,

            initializeEventsListeners,
            initializeListenersForBarButtons,
            initializeLibrary,

            findUserPosition,
            showError,

            searchByPosiiton,
            searchByPosiitonComplete,

            firstGeoLocationFailed,
            firstGeoLocationFound,
            geoLocationFailed,
            geoLocationFound;


        /**
         * If browser handles geolocation functionality search for user positionś
         */
        findUserPosition = function () {

            if (_geoLocation) {
                if (!_geoLocation.isSearching()) {
                    _geoLocation.setPeriod(20);
                    _geoLocation.getCurrentPosition(firstGeoLocationFound, firstGeoLocationFailed);
                    _geoLocation.watchPosition(geoLocationFound, geoLocationFailed);
                }
            } else {
                firstGeoLocationFailed();
            }
        };

        /**
         *
         */
        firstGeoLocationFailed = function () {
            //showError(_message.error.positioningFailed);
            _customEvent.fire("geoLocationFailed");
        };

        geoLocationFailed = function () {
            _customEvent.fire("geoLocationFailed");
        };

        /**
         * @todo - spy if updating location info is not to often here ...
         * @param position
         */
        geoLocationFound = function (position) {
            _customEvent.fire("geoLocationFound", {
                position: position
            });

            searchByPosiiton(position, searchByPosiitonComplete);
        };

        firstGeoLocationFound = function (position) {
            _customEvent.fire("geoLocationFound", {
                position: position
            });

            searchByPosiiton(position, function (data, requestStatus, requestId) {
                searchByPosiitonComplete(data, requestStatus, requestId, true);
            });
        };

        searchByPosiiton = function (position, callback) {
            nokia.places.search.manager.reverseGeoCode({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                onComplete: callback
            });
        };

        searchByPosiitonComplete = function (data, requestStatus, requestId, searchForItems) {

            if (requestStatus === "OK") {

                var locations = data.results ? data.results.items : [data.location];

                _customEvent.fire("searchByPositionSucceed", {
                    locations: locations
                });

                if (searchForItems) {
                    //call some funcion
                    //that will do ajax for
                    //_serviceUrl + locations[0]
                }

            } else {
                _customEvent.fire("searchByPositionFailed");
            }
        };

        initializeListenersForBarButtons = function () {

            /**
             * @todo
             * bar - think about having events fired directly from object : bar.on('listButtonClick')
             * instead of populating it to global events system
             */
            _customEvent.on("zoomInBtnClick", function () {
                _customEvent.fire("mapZoomInRequired");
            });

            _customEvent.on("zoomOutBtnClick", function () {
                _customEvent.fire("mapZoomOutRequired");
            });

            _customEvent.on("searchBtnClick", function () {
                _customEvent.fire("moduleRequired", {
                    moduleName: "search"
                });
            });

            _customEvent.on("listBtnClick", function () {
                _customEvent.fire("moduleRequired", {
                    moduleName: "list"
                });
            });

            _customEvent.on("mapBtnClick", function () {
                _customEvent.fire("moduleRequired", {
                    moduleName: "map"
                });
            });

        };

        /**
         * @todo make lang a param delivered to App in constructor (default one set to en-GB)
         */
        initializeLibrary = function () {
            nokia.Settings.set("appId", _appId);
            nokia.Settings.set("authenticationToken", _authToken);
            nokia.Settings.set("defaultLanguage", "pl-PL");
        };

        /**
         * initialize listeners for some custom events (merge actions and reactions)
         * implement concept that Application as a main Class matches global events and listeners together so
         * modules (components) don't have to know about each other - just listen to something and fire something -
         * Application is connecting logic(s)
         */
        initializeEventsListeners = function () {

            initializeListenersForBarButtons();

            //_customEvent.on("geoLocationFound", function () {
               //_customEvent.fire("geoLocationFound")
            //});
        };

        /**
         * @constructor
         */
        init = function () {

            var _bar,
                _listModule,
                _mapModule,
                _searchModule;

            initializeLibrary();

            //initialize views
            _searchModule = new NS.SearchModule({
                node: document.getElementById("search")
            });

            _mapModule = new NS.MapModule({
                node: document.getElementById("map")
            });

            _listModule = new NS.ListModule({
                node: document.getElementById("list")
            });

            _bar = new NS.Bar({
                node: document.getElementById("bar")
            });


            //match events and listeners
            initializeEventsListeners();

            //initialize position service
            findUserPosition();

            //request for default View
            _customEvent.fire("moduleRequired", {
                moduleName: "map"
            });
        };

        init();

    };

})(document, window, util, service);
