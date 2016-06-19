const _ = require('lodash');
const ReactDOM = require('react-dom');
const app = require('core/app');
const createElementWithContext = require('fluxible-addons-react/createElementWithContext');

let dehydratedState = {};

app.rehydrate(dehydratedState, (err, context) => {
    if (err) {
        throw err;
    }
    
    // TODO: validate additionalContext
    context = _.assign(context, additionalContext); // additional context from django request
    window.context = context; // For accessing from browser console
    
    var mountNode = document.getElementById('app');
    ReactDOM.render(createElementWithContext(context, {}), document.getElementById('content'));
});
