/**
 * main constructor to whole application
 * defines configuration and should be executed by body.onload
 * @param NS {Object} - namespace object
 */
(function (NS, browser, dataUtil) {

    var config = {
        //clientId: "euronetpl",
        clientId: "web-client-app-refactoring",
        lang: "pl-PL",
        serviceUrl: dataUtil.getPath(),
        //serviceUrl: "http://services.karpicki.com/cashgroupde/get.php?client_type=web",
        hereCom: {
            appId: "AEhWqyOrNFeSEuZR13yC",
            authToken: "I5XkyHg6aLM_8w_a346hPA"
        }
    };

    NS.init = function () {

        var scrollOptions = {
                hScroll: true,
                hScrollbar: true,
                vScrollbar: false
            },
            isAndroidOrOldIOS = !!(browser.isAndroid() || (browser.isIOS() && browser.getIOSVersion() < 5));

        /**
         * @readme
         * using iScroll lib for fixing missing scroll functionality for some browsers
         * currently library is not lazy loaded but just used (will eedto think if better to lazy load or
         * have in manifest file anyway
         */
        if (browser.isMeego() || isAndroidOrOldIOS) {

            var listScroll = new iScroll('list', scrollOptions);
        }

        if (isAndroidOrOldIOS) {
           
            var searchScroll = new iScroll('search', scrollOptions);
        }

        return new  NS.Application(config);
    };

}(window, window.util.browser, window.dataUtil));
