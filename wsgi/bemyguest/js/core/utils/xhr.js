const xhr = require('xhr');

function handleData(actionContext, successCallback, errorCallback, resp) {
    if (resp.statusCode != 200) {
        if (errorCallback) {
            errorCallback(resp);
        }
        else {
            alert('Stala sa chyba.');
            console.log(resp);
        }
    }
    else if (resp.body.error && resp.body.error == 'loggedOut') {
        actionContext.dispatch('USER_LOGGED_OUT');
    }
    else if (resp.body.error) {
        if (errorCallback) {
            errorCallback(resp);
        }
        else {
            alert('Stala sa chyba.');
            console.log(resp);
        }
    }
    else if (successCallback) successCallback(resp);
}

module.exports = {
    get: (actionContext, url, successCallback, errorCallback) => {
        xhr({url: url, responseType: 'json'}, (err, resp, body) => {
            handleData(actionContext, successCallback, errorCallback, resp);
        });
    },
    post: (actionContext, url, data, successCallback, errorCallback) => {
        xhr({url: url, json: data, method: 'post', responseType: 'json'}, (err, resp, body) => {
            handleData(actionContext, successCallback, errorCallback, resp);
        });
    }
};
