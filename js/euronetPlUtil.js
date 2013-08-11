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
         * @fixme - calculation seems to not work
         * @param item
         * @param position
         */
        getDistance: function (item, position) {

            if (!position) {
                return 0;
            }

            var toRad = function (val) {
                return val * Math.PI / 180;
            };


            var lat1 = item.position.latitude,
                lat2 = position.latitude,
                lon1 = item.position.longitude,
                lon2 = position.longitude,
            
                R = 6371, // km
                dLat = toRad(lat2-lat1),
                dLon = toRad(lon2-lon1),
                lat1 = toRad(lat1),
                lat2 = toRad(lat2),

                a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2),
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),
                d = R * c;


            return d;
        }
    };

} (window));