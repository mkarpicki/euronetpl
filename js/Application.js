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
        _geoLocation = service.geoLocation;

    NS.Application = function (params) {

        var _serviceUrl = params.serviceUrl,
            _appId = params.hereCom.appId,
            _authToken = params.hereCom.authToken,
            _clientId = params.clientId,
            _lang = params.lang || "en-GB",

            init,

            initializeEventsListeners,
            initializeListenersForBarButtons,
            initializeLibrary,

            findUserPosition,

            searchByPosition,
            searchByPositionComplete,

            firstGeoLocationFailed,
            firstGeoLocationFound,
            geoLocationFailed,
            geoLocationFound,

            useService;


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
         * @todo - merge this and next method ?
         */
        firstGeoLocationFailed = function () {
            //showError(_message.error.positioningFailed);
            _customEvent.fire("geoLocationFailed");
        };

        geoLocationFailed = function () {
            _customEvent.fire("geoLocationFailed");
        };

        /**
         * @todo try to merge this and next method
         * @todo - spy if updating location info is not to often here ...
         * @param position
         */
        geoLocationFound = function (position) {
            _customEvent.fire("geoLocationFound", {
                position: position
            });

            searchByPosition(position, searchByPositionComplete);
        };

        firstGeoLocationFound = function (position) {
            _customEvent.fire("geoLocationFound", {
                position: position
            });

            searchByPosition(position, function (data, requestStatus, requestId) {
                searchByPositionComplete(data, requestStatus, requestId, true);
            });
        };

        /**
         * Uses HERE's library to get address by ge position (lat , lon)
         * @param position <Object>
         * @param callback <Function>
         */
        searchByPosition = function (position, callback) {
            nokia.places.search.manager.reverseGeoCode({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                onComplete: callback
            });
        };

        /**
         * Callback for completed reverse geocode call. Fires an event depending if call succeed or failed.
         * Optional param trigger search in delivered service for items (as a default results for first app view)
         * @param data <Object>
         * @param requestStatus <String>
         * @param requestId <String>
         * @param searchForItems (optional) <Boolean>
         */
        searchByPositionComplete = function (data, requestStatus, requestId, searchForItems) {

            if (requestStatus === "OK") {

                var locations = data.results ? data.results.items : [data.location];

                _customEvent.fire("searchByPositionSucceed", {
                    location: locations[0]
                });

                if (searchForItems) {
                    useService(locations[0]);
                }

            } else {
                _customEvent.fire("searchByPositionFailed");
            }
        };

        /**
         *
         * @param address <Object>
         * @param stopOnError <Boolean>
         */
        useService = function (locationObject, stopOnError) {

            var address = locationObject.address,
                city = address.city,
                postalCode = address.postalCode,
                request,
                street = address.street,
                params;

            //city = "Berlin";
            //street = "Simon-Dach-Str";
            //postalCode = "10245";

            params = encodeURI("&client_id="+ _clientId + "&callback=fake&street=" + street + "&postcode=" + postalCode + "&city=" + city);

            debugger;

            request = new util.Request({
                dataType: "json",
                url: _serviceUrl + params,
                onSuccess: function (result) {

                    debugger;

                    var response = result.response || {},
                        error = response.error,
                        items = response.items,
                        item;

                    if (error) {
                        //known eror
                        //try one more time
                        if (!stopOnError) {
                            useService(address, true) ;
                        } else {
                            alert(_message.error.serviceError);
                        }
                    } else if (items.length > 0) {
                        console.log("show results");
                    } else {
                        console.log("no results");
                    }
                },
                onError: function (error) {
                    debugger;
                }
            });

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
         * Sets settings to register application in HERE library and set language
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
         * Initializes Modules
         * Initialize matches between custom events and listeners (@todo re think that idea)
         * Initialize saerching for user's position
         * Requests for default module
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
