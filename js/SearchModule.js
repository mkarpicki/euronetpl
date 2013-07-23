/**
 *
 * @param param
 */
(function (document, NS, util, messages) {

    var _customEvent = util.customEvent,
        _messages = messages;

    NS.SearchModule = function (params) {

        var _node = params.node,
            _geoAddressNode = document.getElementById("search-gps-status"),

            initialize,
            initializeCustomListeners,

            onModuleRequired,
            onSearchByPositionSucceed,
            onSearchByPositionFailed,

            hide,
            show;

        /**
         * @constructor
         */
        initialize = function () {

            initializeCustomListeners();
        };

        /**
         * initialize custom event listeners
         */
        initializeCustomListeners = function () {

            _customEvent.addListeners({
                moduleRequired: onModuleRequired,
                searchByPositionSucceed: onSearchByPositionSucceed,
                searchByPositionFailed: onSearchByPositionFailed
            });
        };

        onModuleRequired = function (event) {

            if (event.params.moduleName === "search") {
                show();
            } else {
                hide();
            }

        };

        onSearchByPositionSucceed = function (event) {

            var locations = event.params.locations;

            if (locations.length > 0) {
                _geoAddressNode.innerHTML = locations[0].address.text;
            } else {
                _geoAddressNode.innerHTML = _messages.saerchModule.geoLocationNotFound;
            }
        };

        onSearchByPositionFailed = function () {
            _geoAddressNode.innerHTML = _messages.saerchModule.geoLocationFailed;
        };

        /**
         * show view
         */
        show = function () {
            _node.style.display = "block";
            //_customEvent.fire("searchModuleOpened");
        };

        /**
         * hides view
         */
        hide = function () {
            _node.style.display = "none";
        };

        initialize();

    };

} (document, window, util, messages));
