const moment = require('moment');
require('moment/locale/sk');

module.exports = {
    clickActions: (click, dblclick) => {
        let clicks = 0, timeout;
        return function(e) {
            clicks++;
            e.persist();
            if (clicks == 1) {
                timeout = setTimeout(function () {
                    click(e);
                    clicks = 0;
                }, 250);
            } else {
                clearTimeout(timeout);
                dblclick(e);
                clicks = 0;
            }
        };
    },

    getActionContext: () => {
        return window.context.getActionContext();
    },

    substr: (text, length) => {
        if (text.length < length) return text;
        return text.substr(length) + '...';
    },

    shouldBeApproved: (days) => {
        if (days > 7) return true;
        return false;
    },

    approvalBy: (days) => {
        if (days > 30) return 'CANONRY';
        if (days > 14) return 'PRIOR';
        if (days > 7) return 'PREFECT';
        return 'OTHER';
    },

    diffDays: (dateFrom, dateTo) => {
        return moment(dateTo).startOf('day').diff(moment(dateFrom).startOf('day'), 'days') + 1;
    },

    getDatesRange: (dateFrom, dateTo) => {
        let dates = [];
        for (let d = moment(dateFrom); d.isSameOrBefore(dateTo, 'day'); d.add(1, 'days')) {
            dates.push(moment(d));
        }
        return dates;
    },

    translateEventType: (type) => {
        if (type == 1) return 'LITURGICAL';
        if (type == 2) return 'COMMUNITY';
    }
}
