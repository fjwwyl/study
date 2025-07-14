const {marked} = require("marked");

module.exports = function (source) {
    const options = this.getOptions();

    const ret = marked.parse(source);
    return ret;
}