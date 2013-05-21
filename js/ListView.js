/**
 * View represnts list of search results
 * @param params
 * params.view {DOMNode}
 * @require util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 */
var ListView = function (params) {

    var _node = params.node,

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
        _node.style.display = "none";
    };

    /**
     * Shoes view
     */
    show = function () {
        _node.style.display = "block";
    };

    initialize();
};