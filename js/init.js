/**
 * main constructor to whole application
 * defines configuration and should be executed by body.onload
 * @param NS {Object} - namespace object
 */
(function (NS) {

    var config = {
        //clientId: "euronetpl",
        clientId: "web-client-app-refactoring",
        lang: "pl-PL",
        //serviceUrl: "http://services.karpicki.local/euronetpl/get.php?client_type=web",
        serviceUrl: "http://services.karpicki.com/cashgroupde/get.php?client_type=web",
        hereCom: {
            appId: "AEhWqyOrNFeSEuZR13yC",
            authToken: "I5XkyHg6aLM_8w_a346hPA"
        }
    };

    NS.init = function () {
        return new  NS.Application(config);
    };

}(window));
