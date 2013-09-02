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

        getDetailsInfo: function (item) {
            return item.name + ".<br>" + item.street + ", " + " " + item.city;
        },

        /**
         * fixme - calculation seems to not work
         * @param item
         * @param position
         */
        getDistance: function (item, position) {

            if (!position) {
                return 0;
            }

            var lat1 = item.position.latitude,
                lat2 = position.latitude,
                lon1 = item.position.longitude,
                lon2 = position.longitude,

                latDistance = Math.pow(lat2 - lat1, 2),
                lonDistance = Math.pow(lon2 - lon1, 2);

            return Math.sqrt(latDistance + lonDistance);

        }
    };

} (window));