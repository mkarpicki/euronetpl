/**
 * Main Application Class
 *
 * @todo move nokia lib as dependency
 * rethink how to define dependencies instead of util.something - maybe something directly

 * @param document - HTML Document Object
 * @param NS - {Object} namespace that module should live in
 * @param customEvent - object that delivers support for handling custom events
 * @param geoLocationService {Object}
 * @param messages {Object} delivered messasges to be displayed
 * @param dataUtil - customized object with implemented methods for proper displaying data info*

 * @require {util.customEvent} (http://common.karpicki.com/front/util/customEvent.js)
 * @require {service.geoLocation} common.karpicki.com/front/service/mobileGeoLocation.js
 * @requires HERE JavaScript API (http://developer.here.com)*
 */
(function (document, NS, customEvent, geoLocationService, messages, dataUtil) {

    /**
     * Main Class. Controller that connects to external search services and set state via custom events
     * @param serviceUrl <String> url to REST service which will provide items to be find
     * @param hereCom {Object} {
     * - appId <String> identifier for application for here.com library
     * - authToken <String> token for application
     * }
     * @param clientId <String> identifier for application
     * @param lang <String> language e.g "en-GR"
     */
    NS.Application = function (params) {

        var _serviceUrl = params.serviceUrl,
            _appId = params.hereCom.appId,
            _authToken = params.hereCom.authToken,
            _clientId = params.clientId,
            _lang = params.lang || "en-GB",
            _firstGeoPositionFound = false,
            _currentPosition = null,
            _currentAddress = null,

            init,

            initializeCustomListeners,
            initializeLibrary,
            initializeModules,

            itemsSortHelper,

            findUserPosition,

            searchForAddressByPosition,
            searchForAddressByPositionCompleted,
            searchForItemsFinished,

            firstGeoLocationFailed,
            firstGeoLocationFound,
            geoLocationFailed,
            geoLocationFound,

            useService,

            showError;


        /**
         * If browser handles geolocation functionality search for user positionś
         */
        findUserPosition = function () {

            if (geoLocationService) {
                if (!geoLocationService.isSearching()) {
                    geoLocationService.setPeriod(20);
                    geoLocationService.getCurrentPosition(firstGeoLocationFound, firstGeoLocationFailed);
                    geoLocationService.watchPosition(geoLocationFound, geoLocationFailed);
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
            customEvent.fire("geoLocationFailed");
        };

        geoLocationFailed = function () {
            customEvent.fire("geoLocationFailed");
        };

        /**
         * @todo try to merge this and next method
         * @todo - spy if updating location info is not to often here ...
         * @param position
         */
        geoLocationFound = function (position) {
            customEvent.fire("geoLocationFound", {
                position: position
            });

        };

        firstGeoLocationFound = function (position) {

            customEvent.fire("geoLocationFound", {
                position: position
            });

        };

        itemsSortHelper = function (item1, item2) {
            var distance1 = dataUtil.getDistance(item1, _currentPosition.coords),
                distance2 = dataUtil.getDistance(item2, _currentPosition.coords);

            return distance1 > distance2;
        };

        /**
         * Uses HERE's library to get address by ge position (lat , lon)
         * @param position <Object>
         * @param callback <Function>
         */
        searchForAddressByPosition = function (position, callback) {
            nokia.places.search.manager.reverseGeoCode({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                onComplete: callback
                //fire event here ?
            });
        };

        /**
         * @todo - think about removing last param and make it depended on some flag in that class
         * Callback for completed reverse geocode call. Fires an event depending if call succeed or failed.
         * Optional param trigger search in delivered service for items (as a default results for first app view)
         * @param data <Object>
         * @param requestStatus <String>
         * @param requestId <String>
         * @param searchForItems (optional) <Boolean>
         */
        searchForAddressByPositionCompleted = function (data, requestStatus, requestId, searchForItems) {

            if (requestStatus === "OK") {

                var locations = data.results ? data.results.items : [data.location];

                _currentAddress = locations[0];

                customEvent.fire("searchByPositionSucceed", {
                    location: _currentAddress
                });

                if (searchForItems) {
                    customEvent.fire("searchForItemsRequired", {
                        address: _currentAddress
                    });
                }

            } else {
                customEvent.fire("searchByPositionFailed");
            }
        };

        /**
         * If items found sort if position was set and inform the world,
         * otherwise just inform world that no results found
         * @param items
         */
        searchForItemsFinished = function (items) {

            var properItems = [];

            for (var i = 0, len = items.length, item; i < len; i++) {
                item = items[i];
                if (item.position) {
                    properItems.push(item);
                }
            }

            items = properItems;

            if (items.length > 0) {

                items.sort(itemsSortHelper);

                customEvent.fire("searchItemsFound", {
                    items: items
                });
            } else {
                customEvent.fire("searchItemsNotFound");
            }
        };

        showError = function (message) {
            console.log(message);
        };

        /**
         * @todo implement error handling here
         * @param address <Object>
         * @param stopOnError <Boolean>
         */
        useService = function (locationObject, stopOnError, userPosition) {

            var address = locationObject.address,
                city = encodeURI(address.city),
                postalCode = encodeURI(address.postalCode),
                request,
                street = encodeURI(address.street),
                params;

            //city = "Berlin";
            //street = "Simon-Dach-Str";
            //postalCode = "10245";

            customEvent.fire("searchForItemsFired");

            params = "&client_id="+ _clientId + "&callback=fake&street=" + street + "&postcode=" + postalCode + "&city=" + city;

            request = new util.Request({
                dataType: "jsonp",
                url: _serviceUrl + params,
                onSuccess: function (result) {

                    var error = result.error,
                        items = result.items || [];

                    if (error) {

                        //service sometimes fails -> try one more time
                        if (!stopOnError) {

                            useService({address: address }, true, userPosition);

                        } else {
                            /**
                             * todo remove me
                             */
                            showError(messages.error.serviceError);
                            customEvent.fire("searchItemsFailed");
                        }
                    } else {
                        searchForItemsFinished(items);
                    }
                },
                onError: function (error) {
                    showError(messages.error.serviceError);
                }
            });

        };

        initializeCustomListeners = function () {

            customEvent.on("geoLocationFound", function (event) {

                _currentPosition = event.params.position;

                customEvent.fire("searchForAddressRequired", {
                    position: _currentPosition
                });

            });

            customEvent.on("searchForAddressRequired", function (event) {

                var position = event.params.position || _currentPosition; // ;

                if (position) {

                    if (!_firstGeoPositionFound) {
                        _firstGeoPositionFound= true;

                        searchForAddressByPosition(position, function (data, requestStatus, requestId) {
                            searchForAddressByPositionCompleted(data, requestStatus, requestId, true);
                        });
                    } else {

                        searchForAddressByPosition(position, searchForAddressByPositionCompleted);
                    }
                }
            });

            customEvent.on("searchForItemsRequired", function (event) {

                var address = event.params.address || _currentAddress;

                useService(address, false, {});
            });
        };

        /**
         * Initialize modules
         * currently we do not need any references to modules so keep instances only in that method
         */
        initializeModules = function () {

            var _bar,
                _listModule,
                _mapModule,
                _searchModule;

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
        };

        /**
         * Sets settings to register application in HERE library and set language
         * @todo make lang a param delivered to App in constructor (default one set to en-GB)
         */
        initializeLibrary = function () {
            nokia.Settings.set("appId", _appId);
            nokia.Settings.set("authenticationToken", _authToken);
            nokia.Settings.set("defaultLanguage", _lang);
        };

        /**
         * @constructor
         * Initializes Modules
         * Initialize matches between custom events and listeners (@todo re think that idea)
         * Initialize searching for user's position
         * Requests for default module
         */
        init = function () {

            initializeLibrary();

            //initialize modules
            initializeModules();

            initializeCustomListeners();

            //initialize position service
            findUserPosition();

            //request for default View
            customEvent.fire("moduleRequired", {
                moduleName: "list"//"map"
            });
        };

        init();

    };

}(document, window, util.customEvent, service.geoLocation, window.messages, window.dataUtil));
