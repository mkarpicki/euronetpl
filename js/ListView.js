/**
 * View represnts list of search results
 * @param params
 * params.view {DOMNode}
 * @require util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 */
(function (NS, util) {

    var _customEvent = util.customEvent;

    NS.ListView = function (params) {

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
            _customEvent.addListeners({
                searchClicked: clearList,
                searchFound: renderList,
                listBtnClick: show,

                searchViewOpened: hide,
                mapViewOpened: hide
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
            _customEvent.fire("listViewOpened");
        };

        initialize();
    };

}(window, util));

