/**
 * View represnts list of search results
 * @param params
 * params.view {DOMNode}
 * @require util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 */
var ListView = function (params) {

    var _view = params.view,

        clearList,
        renderList,
        show,
        hide,

        initialize,
        initializeCustomListeners;

    initialize = function () {

        initializeCustomListeners();
    };

    /**
     * initializes custom event listeners
     */
    initializeCustomListeners = function () {
        util.customEvent.addListeners({
            onSearchClicked: clearList,
            onSearchFound: renderList,
            listIconClick: show
        });
    };

    /**
     * hides view
     */
    hide = function () {
        _view.style.display = "none";
    };

    /**
     * Shoes view
     */
    show = function () {
        _view.style.display = "block";
    };

    initialize();
};