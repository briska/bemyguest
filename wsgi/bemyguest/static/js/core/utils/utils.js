'use strict';

var moment = require('moment');
require('moment/locale/sk');

module.exports = {
    clickActions: function clickActions(click, dblclick) {
        var clicks = 0,
            timeout = void 0;
        return function (e) {
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

    substr: function substr(text, length) {
        if (text.length < length) return text;
        return text.substr(length) + '...';
    },

    shouldBeApproved: function shouldBeApproved(days) {
        if (days > 7) return true;
        return false;
    },

    approvalBy: function approvalBy(days) {
        if (days > 30) return 'CANONRY';
        if (days > 14) return 'PRIOR';
        if (days > 7) return 'PREFECT';
        return 'OTHER';
    },

    diffDays: function diffDays(dateFrom, dateTo) {
        return moment(dateTo).startOf('day').diff(moment(dateFrom).startOf('day'), 'days') + 1;
    },

    getDatesRange: function getDatesRange(dateFrom, dateTo) {
        var dates = [];
        for (var d = moment(dateFrom); d.isSameOrBefore(dateTo, 'day'); d.add(1, 'days')) {
            dates.push(moment(d));
        }
        return dates;
    },

    getHousingPrice: function getHousingPrice(days) {
        return days * 16 + 1;
    },

    getSpiritualPrice: function getSpiritualPrice(days) {
        return days * 2;
    }
};