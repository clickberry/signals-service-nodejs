var Q = require('q');
var moment=require('moment');

module.exports = function (client) {
    var executeAsync = Q.nbind(client.execute, client);

    return {
        add: function (signal, callback) {
            var hour = moment.utc().startOf('hour').valueOf();
            var day = moment.utc().startOf('day').valueOf();
            var week = moment.utc().startOf('isoWeek').valueOf();
            var month = moment.utc().startOf('month').valueOf();

            var signalByHourUpdate = createUpdateQuery('signals_by_hour');
            var signalByDayUpdate = createUpdateQuery('signals_by_day');
            var signalByWeekUpdate = createUpdateQuery('signals_by_week');
            var signalByMonthUpdate = createUpdateQuery('signals_by_month');

            var hourParams = createUpdateParams(signal, hour);
            var dayParams = createUpdateParams(signal, day);
            var weekParams = createUpdateParams(signal, week);
            var monthParams = createUpdateParams(signal, month);

            Q.all([
                executeAsync(signalByHourUpdate, hourParams),
                executeAsync(signalByDayUpdate, dayParams),
                executeAsync(signalByWeekUpdate, weekParams),
                executeAsync(signalByMonthUpdate, monthParams)
            ])
                .then(function (results) {
                    callback(null);
                })
                .catch(function (err) {
                    callback(err);
                });
        }
    };
};

function createUpdateQuery(tableName) {
    return 'UPDATE ' + tableName + ' SET counter=counter+1 WHERE owner_id=? AND relation_id=? AND timestamp=?';
}

function createUpdateParams(siganal, timestamp) {
    return [siganal.ownerId, siganal.id, timestamp];
}