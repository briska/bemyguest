const trans = require('counterpart');

trans.registerTranslations('sk', require('core/locale/sk'));
trans.setLocale('sk');

module.exports = trans;
