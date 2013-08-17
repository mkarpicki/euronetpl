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

            _button = _node.querySelectorAll("button")[0],
            _searchInProgress = true, //should be false and some onReady handling
            _radioSearchGps = _node.querySelectorAll("#search-gps")[0],
            _radioSearchManual = _node.querySelectorAll("#search-manual")[0],

            _cityField = _node.querySelectorAll("#city")[0],
            _postCodeField = _node.querySelectorAll("#post-code")[0],
            _streetField = _node.querySelectorAll("#street")[0],

            initialize,
            initializeCustomListeners,
            initializeSearchHandling,
            insertHtml,

            onModuleRequired,
            onSearchForItemsFired,
            onSearchItemsFailed,
            onSearchByPositionSucceed,
            onSearchByPositionFailed,
            onSearchItemsFinished,

            hide,
            show;

        /**
         * @constructor
         */
        initialize = function () {

            initializeCustomListeners();

            initializeSearchHandling();
        };

        initializeSearchHandling = function () {

            _cityField.onfocus = function () {
                _radioSearchManual.checked = true;
            };

            _button.onclick = function () {

                var params = null,
                    city,
                    street,
                    postalCode;

                if (_searchInProgress) {
                    return;
                }

                if (_radioSearchManual.checked) {

                    city = _cityField ? _cityField.value : null;
                    street = _streetField ? _streetField.value : null;
                    postalCode = _postCodeField ? _postCodeField.value : null;

                    if (city || (city && postalCode) || (city && street)) {
                        params = {};
                        params.address = {
                            city: city,
                            postalCode: postalCode,
                            street: street
                        };
                    }

                //} else if (_radioSearchGps.checked) {
                //    console.log("gps");
                }

                customEvent.fire("searchForItemsRequired", {
                    address: params
                });

                return false;
            };
        };

        /**
         * initialize custom event listeners
         */
        initializeCustomListeners = function () {

            customEvent.addListeners({
                moduleRequired: onModuleRequired,
                searchForItemsFired: onSearchForItemsFired,
                searchItemsFailed: onSearchItemsFailed,
                searchItemsFinished: onSearchItemsFinished,
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

        onSearchForItemsFired = function () {
            _searchInProgress = true;
        };

        onSearchItemsFailed = function () {
            _searchInProgress = false;
        };

        onSearchItemsFinished = function () {
            _searchInProgress = false;
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
