const {transports , format , createLogger} = require('winston');

const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'user.log',
            level: 'info', format: format.combine(format.timestamp(), format.json())
        }) ,
        new transports.File({
            filename: 'error.log',
            level: 'error', format: format.combine(format.timestamp(), format.json())
        })
    ]
});

module.exports = {logger};