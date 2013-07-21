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

            init,
            initializeEventsListeners,
            initializeListenersForBarButtons,
            findUserPosition,
            showError,

            firstGeoLocationFailed,
            geoLocationFailed,
            geoLocationFound;


        /**
         * If browser handles geolocation functionality search for user positionś
         */
        findUserPosition = function () {

            if (_geoLocation) {
                if (!_geoLocation.isSearching()) {
                    _geoLocation.setPeriod(20);
                    _geoLocation.getCurrentPosition(geoLocationFound, firstGeoLocationFailed);
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
            showError(_message.error.positioningFailed);
            _customEvent.fire("geoLocationFailed");
        };

        geoLocationFailed = function () {
            _customEvent.fire("geoLocationFailed");
        };

        geoLocationFound = function (position) {
            _customEvent.fire("geoLocationFound", position);
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
                _customEvent.fire("viewRequired", {
                    viewName: "search"
                });
            });

            _customEvent.on("listBtnClick", function () {
                _customEvent.fire("viewRequired", {
                    viewName: "list"
                });
            });

            _customEvent.on("mapBtnClick", function () {
                _customEvent.fire("viewRequired", {
                    viewName: "map"
                });
            });

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

            //initialize views
            _searchModule = new NS.SearchView({
                node: document.getElementById("search")
            });

            _mapModule = new NS.MapView({
                node: document.getElementById("map"),
                appId: _appId,
                authToken: _authToken
            });

            _listModule = new NS.ListView({
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
            _customEvent.fire("viewRequired", {
                viewName: "map"
            });
        };

        init();

    };

})(document, window, util, service);
