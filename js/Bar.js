/**
 * Bar with links
 * @param params
 * params.node {DOMNode}
 * @todo if borwser supports touch events - hide
 */
var Bar = function (params) {

    var _node = params.node,

        _zoomInBtn = _node.getElementsByClassName("zoom-in-button")[0],
        _zoomOutBtn = _node.getElementsByClassName("zoom-out-button")[0],
        _listBtn = _node.getElementsByClassName("list-button")[0],
        _searchBtn = _node.getElementsByClassName("search-button")[0],
        _mapBtn =  _node.getElementsByClassName("map-button")[0],

        initialize,
        initializeNodeListeners,
        initializeCustomListeners;


    /**
     * @constructor
     */
    initialize = function () {

        initializeNodeListeners();
    };

    initializeNodeListeners = function () {

        _zoomInBtn.onclick = function () {
            util.customEvent.fire("zoomInBtnClick");
            return false;
        };

        _zoomOutBtn.onclick = function () {
            util.customEvent.fire("zoomOutBtnClick");
            return false;
        };

        _searchBtn.onclick = function () {
            util.customEvent.fire("searchBtnClick");
            return false;
        };

        _listBtn.onclick = function () {
            util.customEvent.fire("listBtnClick");
            return false;
        };

        _mapBtn.onclick = function () {
            util.customEvent.fire("mapBtnClick");
            return false;
        };
    };

    initialize();
};