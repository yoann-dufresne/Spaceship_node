/*
 * import desc/* as a module
 */

var fs = require('fs');

eval(fs.readFileSync('core/desc/room_desc.js')+'');
exports.DEFAULT_STATUS = DEFAULT_STATUS;
exports.ROOM = ROOM;

eval(fs.readFileSync('core/desc/player_desc.js')+'');
exports.PLAYER = PLAYER;

eval(fs.readFileSync('core/desc/event_desc.js')+'');
exports.EVENT = EVENT;
exports.EVENT_INHIB = EVENT_INHIB;
exports.EVENT_DENOMINATOR = EVENT_DENOMINATOR;