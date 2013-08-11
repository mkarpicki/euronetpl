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
            itemClicked,
            renderList,
            showNode,
            show,
            hideNode,
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
                searchForItemsFired: onSearchItemsNotFound,
                searchItemsFound: onSearchItemsFound,
                searchItemsNotFound: onSearchItemsNotFound,
                searchItemsFailed: onSearchItemsNotFound,
                itemDetailsRequired: hide
            });
        };

        onSearchItemsFound = function (event) {

            showNode(_resultsNode);
            hideNode(_noResultsNode);

            clearList();
            renderList(event.params.items);
        };

        onSearchItemsNotFound = function () {

            showNode(_noResultsNode);
            hideNode(_resultsNode);

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
                addressLink,
                arrowLink;

            for (var i = 0, len = items.length; i < len; i++) {

                item = items[i];

                listItem = document.createElement("li");
                addressLink = document.createElement("a");
                addressLink.className = "info";
                addressLink.setAttribute("href", "#");

                addressLink.innerHTML = dataUtil.getFullAddress(item);
                addressLink.onclick = (function (item) {
                    return function () {
                        itemClicked(item);
                        return false;
                    };
                }(item));

                arrowLink = document.createElement("a");
                arrowLink.innerHTML = "&nbsp;";
                arrowLink.className = "arrow";
                arrowLink.setAttribute("href", "#");
                arrowLink.onclick = (function (item) {
                    return function () {
                        itemClicked(item);
                        return false;
                    };
                }(item));

                listItem.appendChild(addressLink);
                listItem.appendChild(arrowLink);

                _resultsNode.appendChild(listItem);
            }
        };

        itemClicked = function (item) {

            customEvent.fire("moduleRequired", {
                moduleName: "map"
            });

            customEvent.fire("mapFocusRequired", {
                zoomLevel: 16,
                position: item.position
            });

            customEvent.fire("itemDetailsRequired", {
                item: item
            });

        };

        hide = function () {
            hideNode(_node);
        };

        hideNode = function (node) {
            domUtil.hideNode(node);
        };

        show = function () {
            showNode(_node);
        };

        /**
         * Shoes view
         */
        showNode = function (node) {
            domUtil.showNode(node);
        };

        initialize();
    };

}(window, document, util.dom, util.customEvent, window.dataUtil));

