
/**
 * Bar with links
 * @param NS - namespace in which object will live in
 * @param domUtil - util object with methods for DOM manipulation
 * @param customEvent - object that delivers support for handling custom events
 *
 * @require util.dom (http://common.karpicki.com/front/util/dom.js)
 * @require util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 */
(function (NS, domUtil, customEvent) {

    /**
     * @param params {Object}
     * @param.container {DOM Object} - node that will be container for a map object
     */ 
    NS.Bar = function (params) {

        var _node = params.node,

            _zoomInBtn = _node.querySelectorAll(".zoom-in-button")[0],
            _zoomOutBtn = _node.querySelectorAll(".zoom-out-button")[0],
            _listBtn = _node.querySelectorAll(".list-button")[0],
            _searchBtn = _node.querySelectorAll(".search-button")[0],
            _mapBtn = _node.querySelectorAll(".map-button")[0],
            _refreshBtn = _node.querySelectorAll(".refresh-button")[0],

            _itemsFound = false,

            initialize,
            initializeNodeListeners,
            initializeCustomListeners,
            isDisabled,
            isSpinning,

            moduleRequired,

            onSearchSpinningMode,
            offSearchSpinningMode,

            onSearchModuleOpened,
            onMapModuleOpened,
            onListModuleOpened,
            onSearchItemsFound,
            onSearchItemsNotFound,
            onSearchForItemsFired,
            onSearchItemsFailed,

            onModuleRequired,

            enable,
            disable;

        /**
         * @constructor
         */
        initialize = function () {

            initializeNodeListeners();
            initializeCustomListeners();
        };

        initializeCustomListeners = function (){

            customEvent.addListeners({
                moduleRequired: onModuleRequired,
                searchForItemsFired: onSearchForItemsFired,
                searchItemsFound: onSearchItemsFound,
                searchItemsNotFound: onSearchItemsNotFound,
                searchItemsFailed: onSearchItemsFailed
            });
        };

        initializeNodeListeners = function () {

            _zoomInBtn.onclick = function () {
                if (!isDisabled(this)) {
                    //customEvent.fire("zoomInBtnClick");
                    customEvent.fire("mapZoomInRequired");
                }
                return false;
            };

            _zoomOutBtn.onclick = function () {
                if (!isDisabled(this)) {
                    //customEvent.fire("zoomOutBtnClick");
                    customEvent.fire("mapZoomOutRequired");
                }
                return false;
            };

            _searchBtn.onclick = function () {
                if (!isDisabled(this)) {
                    //customEvent.fire("searchBtnClick");
                    moduleRequired("search");
                }
                return false;
            };

            _listBtn.onclick = function () {
                if (!isDisabled(this)) {
                    //customEvent.fire("listBtnClick");
                    moduleRequired("list");
                }
                return false;
            };

            _mapBtn.onclick = function () {
                if (!isDisabled(this)) {
                    //customEvent.fire("mapBtnClick");
                    moduleRequired("map");
                }
                return false;
            };

            _refreshBtn.onclick = function () {

                if (!isDisabled(this) && !isSpinning(this)) {
                    customEvent.fire("searchForItemsRequired");
                    //customEvent.fire("refreshBtnClick");
                    //do something
                    //return false;
                }
                return false;
            };
        };

        isDisabled = function (elem) {
            return domUtil.hasClass(elem, "disabled");
        };

        isSpinning = function (elem) {
            return domUtil.hasClass(elem, "spinning");
        };

        onSearchItemsFound = function () {
            _itemsFound = true;
            //enable(_listBtn);
            offSearchSpinningMode();
        };
        onSearchItemsNotFound = function () {
            _itemsFound = false;
            offSearchSpinningMode();
        };
        onSearchForItemsFired = function () {
            _itemsFound = false;
            onSearchSpinningMode();
        };
        onSearchItemsFailed = function () {
            _itemsFound = false;
            offSearchSpinningMode();
        };

        onSearchSpinningMode = function () {
            domUtil.addClass(_refreshBtn, "spinning");
        };

        offSearchSpinningMode = function () {
            domUtil.removeClass(_refreshBtn, "spinning");
        };

        onModuleRequired = function (event) {

            var moduleName = event.params.moduleName;

            if (moduleName === "map") {
                onMapModuleOpened();
            } else if (moduleName === "search") {
                onSearchModuleOpened();
            } else if (moduleName === "list") {
                onListModuleOpened();
            }

        };

        onSearchModuleOpened = function () {

            disable(_zoomInBtn);
            disable(_zoomOutBtn);
            disable(_searchBtn);
            //if (_itemsFound) {
                enable(_listBtn);
            //}
            enable(_mapBtn);
            disable(_refreshBtn);
        };

        onMapModuleOpened = function () {

            enable(_zoomInBtn);
            enable(_zoomOutBtn);
            enable(_searchBtn);
            //if (_itemsFound) {
                enable(_listBtn);
            //}
            disable(_mapBtn);
            enable(_refreshBtn); //when results?
        };

        onListModuleOpened = function () {

            disable(_zoomInBtn);
            disable(_zoomOutBtn);
            enable(_searchBtn);
            disable(_listBtn);
            enable(_mapBtn);
            disable(_refreshBtn);
        };

        moduleRequired = function (moduleName) {
            customEvent.fire("moduleRequired", {
                moduleName: moduleName
            });
        };

        /**
         * enable element (button)
         * @param element {DOMNode}
         */
        enable = function (element) {
            domUtil.removeClass(element, "disabled");
        };

        /**
         * disable element (button}
         * @param element {DOMNode}
         */
        disable = function (element) {
            domUtil.addClass(element, "disabled");
        };

        initialize();
    };

}(window, util.dom, util.customEvent));
