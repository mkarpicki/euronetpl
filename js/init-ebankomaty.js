/**
 * main constructor to whole application
 * defines configuration and should be executed by body.onload
 * @param NS {Object} - namespace object
 */
(function (NS, dataUtil) {

    var config = {

        clientId: "ebankomaty-web",
        lang: "pl-PL",

        serviceUrl: dataUtil.getPath(),
        hereCom: {
            appId: "AEhWqyOrNFeSEuZR13yC",
            authToken: "I5XkyHg6aLM_8w_a346hPA"
        }
    };

    NS.init = function () {

        return new  NS.Application(config);
    };

}(window, window.dataUtil));
