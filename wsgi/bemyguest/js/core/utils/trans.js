const _ = require('lodash');
const trans = require('counterpart');

const localeDefaults = {
    counterpart: {
      pluralize: (entry, count) => entry[
        (count === 0 && '0' in entry)
          ? '0' : (count === 1 && '1' in entry) ? '1' : (count >= 2 && count <= 4 && '2-4' in entry) ? '2-4' : 'OTHER'
      ],
      formats: {
        date: {
          'default':  '%a, %e. %b %Y',
          'long':     '%A, %e. %B %Y',
          'short':    '%d.%m.%y'
        },
        time: {
          'default':  '%H:%M',
          'long':     '%H:%M:%S %z',
          'short':    '%H:%M'
        },
        datetime: {
          'default':  '%a, %e. %b %Y, %H:%M',
          'long':     '%A, %e. %B %Y, %H:%M:%S %z',
          'short':    '%d.%m.%y %H:%M'
            }
        }
    }
}

trans.registerTranslations('sk', _.assign(require('core/locale/sk'), localeDefaults));
trans.setLocale('sk');

module.exports = trans;
