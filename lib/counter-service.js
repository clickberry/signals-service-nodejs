var Q = require('q');

module.exports = function (client) {
    var executeAsync = Q.nbind(client.execute, client);

    return {
        inc: function (signal, callback) {
            var signalAllUpdate = 'UPDATE signals_all SET counter=counter+1 WHERE owner_id=? AND relation_id=?';
            var signalByIdUpdate = 'UPDATE signals_by_id SET counter=counter+1 WHERE relation_id=? AND owner_id=?';

            var params1 = [signal.ownerId, signal.id];
            var params2 = [signal.id, signal.ownerId];

            Q.all([
                executeAsync(signalAllUpdate, params1),
                executeAsync(signalByIdUpdate, params2)
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

