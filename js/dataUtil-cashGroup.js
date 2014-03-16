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
            return "http://services.karpicki.com/cashgroupde/get.php?client_type=web";
            //return "http://localhost:8080/cashgroupde/get?client_type=web";
        },

        getFullAddress: function (item) {
            return item.street + ", " + item.postCode + " " + item.city;
        },
        
        getDetailsInfo: function (item) {
            return item.street + "<br>" + item.postCode + " " + item.city;
        },

        getDistance: function (item, position) {
            var d = item.distance || 0;

            if (d) {
                d = parseFloat(d.replace(",", "."));
            }

            return d;
        }
    };

} (window));