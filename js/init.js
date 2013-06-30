/**
 * main constructor to whole application
 * defines configuration and should be executed by body.onload
 */
(function (NS) {

    var config = {
        serviceUrl: "http://services.karpicki.com/euronetpl/get-new.php?client_type=web",
        hereCom: {
            appId: "AEhWqyOrNFeSEuZR13yC",
            authToken: "I5XkyHg6aLM_8w_a346hPA"
        }
    };

    NS.init = function () {
        return new  NS.Application(config);
    };

}(window));
