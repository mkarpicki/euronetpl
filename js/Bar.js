
/**
 * Bar with links
 * @param params
 * params.node {DOMNode}
 * @todo if browser supports touch events - hide
 */
var Bar = function (params) {

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

        onSearchViewOpened,
        onMapViewOpened,
        onListViewOpened,

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

        util.customEvent.addListeners({
            searchViewOpened: onSearchViewOpened,
            mapViewOpened: onMapViewOpened,
            listViewOpened: onListViewOpened
        });
    };

    initializeNodeListeners = function () {

        var customEvent = util.customEvent;

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
                return false;
            }
        };
    };

    isDisabled = function (elem) {
        return util.dom.hasClass(elem, "disabled");
    };

    onSearchViewOpened = function () {

        hide(_zoomInBtn);
        hide(_zoomOutBtn);
        hide(_searchBtn);
        //hide(_listBtn); when no results ?
        show(_mapBtn);
        hide(_refreshBtn);
    };

    onMapViewOpened = function () {

        show(_zoomInBtn);
        show(_zoomOutBtn);
        show(_searchBtn);
        //show(_listBtn); when results ?
        hide(_mapBtn);
        show(_refreshBtn); //when results?
    };

    onListViewOpened = function () {

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
        util.dom.removeClass(element, "disabled");
    };

    /**
     * hide element (button}
     * @param element {DOMNode}
     */
    hide = function (element) {
        util.dom.addClass(element, "disabled");
    };

    initialize();
};