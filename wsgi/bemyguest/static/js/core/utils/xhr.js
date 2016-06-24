'use strict';

var xhr = require('xhr');

function handleData(actionContext, successCallback, errorCallback, resp) {
    if (resp.statusCode != 200) {
        if (errorCallback) {
            errorCallback(resp);
        } else {
            alert('Stala sa chyba.');
            console.log(resp);
        }
    } else if (resp.body.error && resp.body.error == 'loggedOut') {
        actionContext.dispatch('USER_LOGGED_OUT');
    } else if (resp.body.error) {
        if (errorCallback) {
            errorCallback(resp);
        } else {
            alert('Stala sa chyba.');
            console.log(resp);
        }
    } else if (successCallback) successCallback(resp);
}

module.exports = {
    get: function get(actionContext, url, successCallback, errorCallback) {
        xhr({ url: url, responseType: 'json' }, function (err, resp, body) {
            handleData(actionContext, successCallback, errorCallback, resp);
        });
    },
    post: function post(actionContext, url, data, successCallback, errorCallback) {
        xhr({ url: url, json: data, method: 'post', responseType: 'json' }, function (err, resp, body) {
            handleData(actionContext, successCallback, errorCallback, resp);
        });
    }
};