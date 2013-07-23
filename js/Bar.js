
/**
 * Bar with links
 * @param params
 * params.node {DOMNode}
 */
(function (NS, util) {

    var _customEvent = util.customEvent,
        _dom = util.dom;

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

            _customEvent.addListeners({
                onModuleRequired: onModuleRequired
            });
        };

        initializeNodeListeners = function () {

            _zoomInBtn.onclick = function () {
                if (!isDisabled(this)) {
                    _customEvent.fire("zoomInBtnClick");
                }
                return false;
            };

            _zoomOutBtn.onclick = function () {
                if (!isDisabled(this)) {
                    _customEvent.fire("zoomOutBtnClick");
                }
                return false;
            };

            _searchBtn.onclick = function () {
                if (!isDisabled(this)) {
                    _customEvent.fire("searchBtnClick");
                }
                return false;
            };

            _listBtn.onclick = function () {
                if (!isDisabled(this)) {
                    _customEvent.fire("listBtnClick");
                }
                return false;
            };

            _mapBtn.onclick = function () {
                if (!isDisabled(this)) {
                    _customEvent.fire("mapBtnClick");
                }
                return false;
            };

            _refreshBtn.onclick = function () {
                if (!isDisabled(this)) {
                    return false;
                }
            };
        };

        isDisabled = function (elem) {
            return _dom.hasClass(elem, "disabled");
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
            _dom.removeClass(element, "disabled");
        };

        /**
         * hide element (button}
         * @param element {DOMNode}
         */
        hide = function (element) {
            _dom.addClass(element, "disabled");
        };

        initialize();
    };

}(window, util));
