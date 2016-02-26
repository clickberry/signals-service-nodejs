var events = require('events');
var util = require('util');
var nsq = require('nsqjs');

function Bus(options) {
    var bus = this;
    events.EventEmitter.call(this);

    var counterReader = new nsq.Reader('signal-sends', 'signal-counter', options);
    var seriesReader = new nsq.Reader('signal-sends', 'signal-series', options);

    counterReader.connect();
    counterReader.on('message', function (message) {
        var e = {
            signal: message.json(),
            message: message
        };

        bus.emit('counter-inc', e);
    });

    seriesReader.connect();
    seriesReader.on('message', function (message) {
        var e = {
            signal: message.json(),
            message: message
        };

        bus.emit('series-add', e);
    });
}

util.inherits(Bus, events.EventEmitter);

module.exports = Bus;