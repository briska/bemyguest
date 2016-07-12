const _ = require('lodash');
const ReactDOM = require('react-dom');
const app = require('core/app');
const createElementWithContext = require('fluxible-addons-react/createElementWithContext');

let dehydratedState = {};

app.rehydrate(dehydratedState, (err, context) => {
    if (err) {
        throw err;
    }

    if (!_.isString(page)) page = '';
    // TODO: validate additionalContext
    context._componentContext = _.assign(context.getComponentContext(), additionalContext); // additional context from django request
    window.context = context; // For accessing from browser console
    
    var mountNode = document.getElementById('app');
    ReactDOM.render(createElementWithContext(context, {'page': page}), document.getElementById('content'));
});
