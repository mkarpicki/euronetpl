/**
 *
 * @param param
 */
(function (document, NS, util, messages) {

    var _customEvent = util.customEvent,
        _domUtil = util.dom,
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

        /**
         *
         * @param event
         */
        onModuleRequired = function (event) {

            if (event.params.moduleName === "search") {
                show();
            } else {
                hide();
            }

        };

        onSearchByPositionSucceed = function (event) {

            var location = event.params.location;

            if (location) {
                _geoAddressNode.innerHTML = location.address.text;
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
            _domUtil.showNode(_node);
            //_customEvent.fire("searchModuleOpened");
        };

        /**
         * hides view
         */
        hide = function () {
            _domUtil.hideNode(_node);
        };

        initialize();

    };

} (document, window, util, messages));
