/**
 * main constructor to whole application
 * defines configuration and should be executed by body.onload
 */
(function (NS) {

    var config = {
        //clientId: "euronetpl",
        clientId: "cashgroupde",
        lang: "pl-PL",
        //serviceUrl: "http://services.karpicki.local/euronetpl/get.php?client_type=web",
        serviceUrl: "http://services.karpicki.local/cashgroupde/get.php?client_type=web",
        hereCom: {
            appId: "AEhWqyOrNFeSEuZR13yC",
            authToken: "I5XkyHg6aLM_8w_a346hPA"
        }
    };

    NS.init = function () {
        return new  NS.Application(config);
    };

}(window));
