/**
 *
 * @param param
 */
(function (NS, util) {

    var _customEvent = util.customEvent;

    NS.SearchModule = function (params) {

        var _node = params.node,

            initialize,
            initializeCustomListeners,

            onModuleRequired,

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
                moduleRequired: onModuleRequired
                //searchBtnClick: show,

                //listViewOpened: hide,
                //mapViewOpened: hide

            });
        };

        onModuleRequired = function (event) {

            if (event.params.moduleName === "search") {
                show();
            } else {
                hide();
            }

        };

        /**
         * show view
         */
        show = function () {
            _node.style.display = "block";
            //_customEvent.fire("searchModuleOpened");
        };

        /**
         * hides view
         */
        hide = function () {
            _node.style.display = "none";
        };

        initialize();

    };

} (window, util));
