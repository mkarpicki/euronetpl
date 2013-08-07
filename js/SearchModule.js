/**
 * @param document - HTML Document Object
 * @param NS - {Object} namespace that module should live in
 * @param domUtil - util object with DOM manipulation support
 * @param customEvent - object that delivers support for handling custom events
 * @param messages {Object} delivered messasges to be displayed
 *
 * @require {util.dom} (http://common.karpicki.com/front/util/dom.js)
 * @require {util.customEvent} (http://common.karpicki.com/front/util/customEvent.js)
 */
(function (document, NS, domUtil, customEvent, messages) {

    /**
     * @param params {Object}
     * @param.container {DOM Object} - node that will be container for a map object
     */ 
    NS.SearchModule = function (params) {

        var _node = params.node,
            _geoAddressNode = document.getElementById("search-gps-status"),

            initialize,
            initializeCustomListeners,
            insertHtml,

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

            customEvent.addListeners({
                moduleRequired: onModuleRequired,
                searchByPositionSucceed: onSearchByPositionSucceed,
                searchByPositionFailed: onSearchByPositionFailed
            });
        };

        /**
         * inserts text into node
         * @param node
         * @param text
         */
        insertHtml = function (node, text) {
            node.innerHTML = text;
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
                insertHtml(_geoAddressNode, location.address.text);
            } else {
                insertHtml(_geoAddressNode, messages.saerchModule.geoLocationNotFound);
            }
        };

        onSearchByPositionFailed = function () {
            insertHtml(_geoAddressNode, messages.saerchModule.geoLocationFailed);
        };

        /**
         * show view
         */
        show = function () {
            domUtil.showNode(_node);
        };

        /**
         * hides view
         */
        hide = function () {
            domUtil.hideNode(_node);
        };

        initialize();

    };

} (document, window, util.dom, util.customEvent, window.messages));
