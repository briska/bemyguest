'use strict';

var _ = require('lodash');
var ReactDOM = require('react-dom');
var app = require('core/app');
var createElementWithContext = require('fluxible-addons-react/createElementWithContext');

var dehydratedState = {};

app.rehydrate(dehydratedState, function (err, context) {
    if (err) {
        throw err;
    }

    // TODO: validate additionalContext
    context = _.assign(context, additionalContext); // additional context from django request
    window.context = context; // For accessing from browser console

    var mountNode = document.getElementById('app');
    ReactDOM.render(createElementWithContext(context, {}), document.getElementById('content'));
});