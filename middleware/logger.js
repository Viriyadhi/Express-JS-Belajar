const moment = require("moment");
const logger = (res, req, next) => {
    if (logger) {
        console.log(
            "Request received at " + moment().format("MMMM Do YYYY, h:mm:ss a")
        );
        next();
    } else {
        console.log(
            "Request Failed at " + moment().format("MMMM Do YYYY, h:mm:ss a")
        );
    }
};

module.exports = logger;