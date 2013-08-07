
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

            _zoomInBtn = _node.getElementsByClassName("zoom-in-button")[0],
            _zoomOutBtn = _node.getElementsByClassName("zoom-out-button")[0],
            _listBtn = _node.getElementsByClassName("list-button")[0],
            _searchBtn = _node.getElementsByClassName("search-button")[0],
            _mapBtn = _node.getElementsByClassName("map-button")[0],
            _refreshBtn = _node.getElementsByClassName("refresh-button")[0],

            initialize,
            initializeNodeListeners,
            initializeCustomListeners,
            isDisabled,

            onSearchSpinningMode,
            offSearchSpinningMode,

            onSearchModuleOpened,
            onMapModuleOpened,
            onListModuleOpened,

            onModuleRequired,

            show,
            hide;

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
                searchForItemsFired: onSearchSpinningMode,
                searchItemsFound: offSearchSpinningMode,
                searchItemsNotFound: offSearchSpinningMode,
                searchItemsFailed: offSearchSpinningMode
            });
        };

        initializeNodeListeners = function () {

            _zoomInBtn.onclick = function () {
                if (!isDisabled(this)) {
                    customEvent.fire("zoomInBtnClick");
                }
                return false;
            };

            _zoomOutBtn.onclick = function () {
                if (!isDisabled(this)) {
                    customEvent.fire("zoomOutBtnClick");
                }
                return false;
            };

            _searchBtn.onclick = function () {
                if (!isDisabled(this)) {
                    customEvent.fire("searchBtnClick");
                }
                return false;
            };

            _listBtn.onclick = function () {
                if (!isDisabled(this)) {
                    customEvent.fire("listBtnClick");
                }
                return false;
            };

            _mapBtn.onclick = function () {
                if (!isDisabled(this)) {
                    customEvent.fire("mapBtnClick");
                }
                return false;
            };

            _refreshBtn.onclick = function () {
                if (!isDisabled(this)) {
                    customEvent.fire("refreshBtnClick");
                    //do something
                    //return false;
                }
                return false;
            };
        };

        isDisabled = function (elem) {
            return domUtil.hasClass(elem, "disabled");
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

            hide(_zoomInBtn);
            hide(_zoomOutBtn);
            hide(_searchBtn);
            //hide(_listBtn); when no results ?
            show(_mapBtn);
            hide(_refreshBtn);
        };

        onMapModuleOpened = function () {

            show(_zoomInBtn);
            show(_zoomOutBtn);
            show(_searchBtn);
            //show(_listBtn); when results ?
            hide(_mapBtn);
            show(_refreshBtn); //when results?
        };

        onListModuleOpened = function () {

            hide(_zoomInBtn);
            hide(_zoomOutBtn);
            show(_searchBtn);
            hide(_listBtn);
            show(_mapBtn);
            hide(_refreshBtn);
        };

        /**
         * show element (button)
         * @param element {DOMNode}
         */
        show = function (element) {
            domUtil.removeClass(element, "disabled");
        };

        /**
         * hide element (button}
         * @param element {DOMNode}
         */
        hide = function (element) {
            domUtil.addClass(element, "disabled");
        };

        initialize();
    };

}(window, util.dom, util.customEvent));
