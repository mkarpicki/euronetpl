/**
 * Main Application Class
 *
 * @param params
 * param.serviceUrl {String} - url that points to service which wil provide JSONP with results
 *
 * @require global object common.karpicki.com/front/customEvent
 * @require global object common.karpicki.com/browser
 */
var Application = function (params) {

    var _serviceUrl = params.serviceUrl,
        _appId = params.hereCom.appId,
        _authToken = params.hereCom.authToken,

        _bar,
        _listView,
        _mapView,
        _searchView;


    /**
     * initialize views
     */

    _mapView = new MapView({
        node: document.getElementById("map"),
        appId: _appId,
        authToken: _authToken
    });

    _listView = new ListView({
        node: document.getElementById("list")
    });

    _bar = new Bar({
        node: document.getElementById("bar")
    });

};