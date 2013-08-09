/**
 * @param NS - object used as a namespace
 * Util object with public methods that will be used via modules
 * @implement interface
 * - getFullAddress
 * - getDistance
 */
(function (NS) {

    NS.dataUtil = {

        getPath: function () {
            return "http://services.karpicki.com/euronetpl/get.php?client_type=web";
        },

        getFullAddress: function (item) {
            return item.name + ". " + item.street + ", " + " " + item.city;
        },

        getDistance: function (item) {
            var d = item.distance || 0;

            if (d) {
                d = parseFloat(d.replace(",", "."));
            }

            return d;
        }
    };

} (window));