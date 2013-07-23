/**
 * View represnts list of search results
 * @param params
 * params.view {DOMNode}
 * @require util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 */
(function (NS, util) {

    var _customEvent = util.customEvent;

    NS.ListModule = function (params) {

        var _node = params.node,

            clearList,
            renderList,
            show,
            hide,

            initialize,
            initializeCustomListeners,

            onModuleRequired;

        initialize = function () {

            initializeCustomListeners();
        };

        /**
         * initializes custom event listeners
         */
        initializeCustomListeners = function () {
            _customEvent.addListeners({
                moduleRequired: onModuleRequired

            });
        };

        onModuleRequired = function (event) {

            if (event.params.moduleName === "list") {
                show();
            } else {
                hide();
            }

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
            //_customEvent.fire("listModuleOpened");
        };

        initialize();
    };

}(window, util));

