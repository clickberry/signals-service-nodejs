var debug = require('debug')('clickberry:signals:worker');
var config = require('clickberry-config');

var cassandra = require('cassandra-driver');
var client = new cassandra.Client({
    contactPoints: config.getArray('cassandra:nodes'),
    keyspace: config.get('cassandra:keyspace'),
    queryOptions: {
        consistency: cassandra.types.quorum,
        prepare: true
    }
});
var counterService = require('./lib/counter-service')(client);
var seriesService = require('./lib/series-service')(client);

var Bus = require('./lib/bus-service');
var bus = new Bus({
    lookupdHTTPAddresses: config.getArray('nsqlookupd:addresses'),
    maxAttempts: 5
});

bus.on('counter-inc', function (e) {
    counterService.inc(e.signal, function (err) {
        if (err) {
            debug(err);
            return e.message.requeue(30);
        }

        e.message.finish();
    });
});

bus.on('series-add', function (e) {
    seriesService.add(e.signal, function (err) {
        if (err) {
            debug(err);
            return e.message.requeue(30);
        }

        e.message.finish();
    });
});

debug('Listening for messages...');