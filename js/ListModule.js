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
(function (NS, document, domUtil, customEvent, browser, dataUtil) {

    var scrollOptions = {
            hScroll: true,
            hScrollbar: true,
            vScrollbar: false
        },
        isAndroidOrOldIOS = !!(browser.isAndroid() || (browser.isIOS() && browser.getIOSVersion() < 5));

    /**
     * @param params {Object}
     * @param.container {DOM Object} - node that will be container for a map object
     */
    NS.ListModule = function (params) {

        var _node = params.node,
            _resultsNode = _node.querySelectorAll(".items")[0],
            _noResultsNode = _node.querySelectorAll(".no-items")[0],
            _searchingNode = _node.querySelectorAll(".searching")[0],

            clearList,
            itemClicked,
            renderList,
            showNode,
            show,
            hideNode,
            hide,

            initialize,
            initializeCustomListeners,

            onSearchItemsFired,
            onSearchItemsFound,
            onSearchItemsNotFound,
            onModuleRequired;

        initialize = function () {

            /**
             * @readme
             * using iScroll lib for fixing missing scroll functionality for some browsers
             * currently library is not lazy loaded but just used (will eedto think if better to lazy load or
             * have in manifest file anyway
             */
            if (browser.isMeego() || isAndroidOrOldIOS) {

                var listScroll = new iScroll(_node.getAttribute("id"), scrollOptions);
            }            

            initializeCustomListeners();

            showNode(_noResultsNode);
            hideNode(_resultsNode);
            hideNode(_searchingNode);
        };

        /**
         * initializes custom event listeners
         */
        initializeCustomListeners = function () {
            customEvent.addListeners({
                moduleRequired: onModuleRequired,
                searchForItemsFired: onSearchItemsFired,
                searchItemsFound: onSearchItemsFound,
                searchItemsNotFound: onSearchItemsNotFound,
                searchItemsFailed: onSearchItemsNotFound,
                itemDetailsRequired: hide
            });
        };

        onSearchItemsFired = function () {

            hideNode(_noResultsNode);
            hideNode(_resultsNode);
            showNode(_searchingNode);

            clearList();

        };

        onSearchItemsFound = function (event) {

            showNode(_resultsNode);
            hideNode(_noResultsNode);
            hideNode(_searchingNode);

            clearList();
            renderList(event.params.items);
        };

        onSearchItemsNotFound = function () {

            showNode(_noResultsNode);
            hideNode(_resultsNode);
            hideNode(_searchingNode);

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
                addressLink.onclick = (function (item, itemPosition) {
                    return function () {
                        itemClicked(item, itemPosition);
                        return false;
                    };
                }(item, i));

                arrowLink = document.createElement("a");
                arrowLink.innerHTML = "&nbsp;";
                arrowLink.className = "arrow";
                arrowLink.setAttribute("href", "#");
                arrowLink.onclick = (function (item, itemPosition) {
                    return function () {
                        itemClicked(item, itemPosition);
                        return false;
                    };
                }(item, i));

                listItem.appendChild(addressLink);
                listItem.appendChild(arrowLink);

                _resultsNode.appendChild(listItem);
            }
        };

        itemClicked = function (item, itemPosition) {

            customEvent.fire("moduleRequired", {
                moduleName: "map"
            });

            customEvent.fire("mapFocusRequired", {
                zoomLevel: 16,
                position: item.position
            });

            customEvent.fire("itemDetailsRequired", {
                item: item,
                itemPosition: itemPosition
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

}(window, document, util.dom, util.customEvent, util.browser, window.dataUtil));

