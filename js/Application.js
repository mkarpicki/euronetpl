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
(function (doc, NS, util, service) {

    var _customEvent = util.customEvent,
        _geoLocation = service.geoLocation,
        _message = NS.message;

    NS.Application = function (params) {

        var _serviceUrl = params.serviceUrl,
            _appId = params.hereCom.appId,
            _authToken = params.hereCom.authToken,

            _bar,
            _listView,
            _mapView,
            _searchView,

            init,
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

        /**
         * @constructor
         */
        init = function () {

            //initialize views
            _searchView = new NS.SearchView({
                node: doc.getElementById("search")
            });

            _mapView = new NS.MapView({
                node: doc.getElementById("map"),
                appId: _appId,
                authToken: _authToken
            });

            _listView = new NS.ListView({
                node: doc.getElementById("list")
            });

            _bar = new NS.Bar({
                node: doc.getElementById("bar")
            });

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
