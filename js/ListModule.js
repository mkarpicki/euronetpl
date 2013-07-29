/**
 * View represnts list of search results
 * @param params
 * params.view {DOMNode}
 * @require util.customEvent (http://common.karpicki.com/front/util/customEvent.js)
 */
(function (NS, document, util, dataUtil) {

    var _customEvent = util.customEvent,
        _domUtil = util.dom;

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

            onItemsFound,
            onItemsNotFound,
            onModuleRequired;

        initialize = function () {

            initializeCustomListeners();
        };

        /**
         * initializes custom event listeners
         */
        initializeCustomListeners = function () {
            _customEvent.addListeners({
                moduleRequired: onModuleRequired,
                itemsFound: onItemsFound,
                itemsNotFound: onItemsNotFound
            });
        };

        onItemsFound = function (event) {

            _domUtil.showNode(_resultsNode);
            _domUtil.hideNode(_noResultsNode);

            clearList();
            renderList(event.params.items);
        };

        onItemsNotFound = function () {

            _domUtil.showNode(_noResultsNode);
            _domUtil.hideNode(_resultsNode);

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

                console.log(item);

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
            _domUtil.hideNode(_node);
        };

        /**
         * Shoes view
         */
        show = function () {
            _domUtil.showNode(_node);
            //_customEvent.fire("listModuleOpened");
        };

        initialize();
    };

}(window, document, util, window.cashGroupDeUtil));

