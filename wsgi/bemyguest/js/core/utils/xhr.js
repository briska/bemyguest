const xhr = require('xhr');

function executeCallback(errorCallback, resp) {
    if (errorCallback) {
        errorCallback(resp);
    }
    else {
        alert('Stala sa chyba.');
        console.log(resp);
    }
}

function handleData(actionContext, successCallback, errorCallback, resp) {
    if (resp.statusCode != 200) {
        executeCallback(errorCallback, resp);
    }
    else if (resp.body.error && resp.body.error == 'loggedOut') {
        if (errorCallback) {
            errorCallback(resp);
        }
        actionContext.dispatch('USER_LOGGED_OUT');
    }
    else if (resp.body.error) {
        executeCallback(errorCallback, resp);
    }
    else if (successCallback) successCallback(resp);
}

module.exports = {
    get: (actionContext, url, successCallback, errorCallback) => {
        xhr({url: url, method: 'get', responseType: 'json'}, (err, resp, body) => {
            handleData(actionContext, successCallback, errorCallback, resp);
        });
    },
    post: (actionContext, url, data, successCallback, errorCallback) => {
        xhr({url: url, json: data, method: 'post', responseType: 'json'}, (err, resp, body) => {
            handleData(actionContext, successCallback, errorCallback, resp);
        });
    },
    delete: (actionContext, url, data, successCallback, errorCallback) => {
        xhr({url: url, json: data, method: 'delete', responseType: 'json'}, (err, resp, body) => {
            handleData(actionContext, successCallback, errorCallback, resp);
        });
    }
};
