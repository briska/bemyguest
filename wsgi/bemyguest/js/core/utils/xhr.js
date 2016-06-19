const xhr = require('xhr');

module.exports = {
    get: (url, success, error) => {
        xhr({url: url, responseType: 'json'}, (err, resp, body) => {
            if (resp.statusCode != 200) {
                console.log(err);
                if (error) error(resp);
                alert('Stala sa chyba.');
            }
            else if (success) success(resp);
        });
    },
    post: (url, data, success, error) => {
        xhr({url: url, json: data, method: 'post', responseType: 'json'}, (err, resp, body) => {
            if (resp.statusCode != 200) {
                console.log(err);
                if (error) error(resp);
                alert('Stala sa chyba.');
            }
            else if (success) success(resp);
        });
    }
};
