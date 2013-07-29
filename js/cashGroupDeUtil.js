(function (NS) {

    NS.cashGroupDeUtil = {

        getFullAddress: function (item) {
            return item.street + ", " + item.postCode + " " + item.city;
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