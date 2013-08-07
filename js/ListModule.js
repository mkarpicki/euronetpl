/**
 * View represnts list of search results
 * @param NS - {Object} namespace that module should live in
 * @param document - HTML Document Object
 * @param domUtil - util object with DOM manipulation support
 * @param customEvent - object that delivers support for handling custom events
 * @param dataUtil - customized object with implemented methods for proper displaying data info
 * 
 * @require util.dom (http://common.karpicki.com/front/util/dom.js)
 * @require util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 */
(function (NS, document, domUtil, customEvent, dataUtil) {

    /**
     * @param params {Object}
     * @param.container {DOM Object} - node that will be container for a map object
     */
    NS.ListModule = function (params) {

        var _node = params.node,
            _resultsNode = _node.getElementsByClassName("items")[0],
            _noResultsNode = _node.getElementsByClassName("no-items")[0],

            clearList,
            renderList,
            show,
            hide,

            initialize,
            initializeCustomListeners,

            onSearchItemsFound,
            onSearchItemsNotFound,
            onModuleRequired;

        initialize = function () {

            initializeCustomListeners();
        };

        /**
         * initializes custom event listeners
         */
        initializeCustomListeners = function () {
            customEvent.addListeners({
                moduleRequired: onModuleRequired,
                searchItemsFired: onSearchItemsNotFound,
                searchItemsFound: onSearchItemsFound,
                searchItemsNotFound: onSearchItemsNotFound,
                searchItemsFailed: onSearchItemsNotFound
            });
        };

        onSearchItemsFound = function (event) {

            show(_resultsNode);
            hide(_noResultsNode);

            clearList();
            renderList(event.params.items);
        };

        onSearchItemsNotFound = function () {

            show(_noResultsNode);
            hide(_resultsNode);

            clearList();
        };

        onModuleRequired = function (event) {

            if (event.params.moduleName === "list") {
                show();
            } else {
                hide();
            }

        };

        /**
         * Clear list of search results
         */
        clearList = function () {
            _resultsNode.innerHTML = "";
        };

        /**
         * Render list with items
         * @param items
         */
        renderList = function (items) {

            var item,
                listItem,
                link;

            for (var i = 0, len = items.length; i < len; i++) {

                item = items[i];

                listItem = document.createElement("li");
                link = document.createElement("a");
                link.setAttribute("href", "#");

                //temporary
                link.innerHTML = dataUtil.getFullAddress(item);
                link.onclick = (function (item) {
                    return function () {
                        console.log(item);
                    };
                }(item));

                listItem.appendChild(link);

                _resultsNode.appendChild(listItem);
            }
        };

        /**
         * hides view
         */
        hide = function () {
            domUtil.hideNode(_node);
        };

        /**
         * Shoes view
         */
        show = function () {
            domUtil.showNode(_node);
            //customEvent.fire("listModuleOpened");
        };

        initialize();
    };

}(window, document, util.dom, util.customEvent, window.cashGroupDeUtil));

