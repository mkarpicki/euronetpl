/**
 *
 * @param param
 */
var SearchView = function (params) {

    var _node = params.node,
        _customEvent = util.customEvent,

        initialize,
        initializeCustomListeners,

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
            searchBtnClick: show,
            
            listViewOpened: hide,
            mapViewOpened: hide
        });
    };

    /**
     * show view
     */
    show = function () {
        _node.style.display = "block";
        _customEvent.fire("searchViewOpened");
    };

    /**
     * hides view
     */
    hide = function () {
        _node.style.display = "none";
    };

    initialize();

};