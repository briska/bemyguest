'use strict';

var xhr = require('xhr');

module.exports = {
    get: function get(url, success, error) {
        xhr({ url: url, responseType: 'json' }, function (err, resp, body) {
            if (resp.statusCode != 200) {
                console.log(err);
                if (error) error(resp);
                alert('Stala sa chyba.');
            } else if (success) success(resp);
        });
    },
    post: function post(url, data, success, error) {
        xhr({ url: url, json: data, method: 'post', responseType: 'json' }, function (err, resp, body) {
            if (resp.statusCode != 200) {
                console.log(err);
                if (error) error(resp);
                alert('Stala sa chyba.');
            } else if (success) success(resp);
        });
    }
};