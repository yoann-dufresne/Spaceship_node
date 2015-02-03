var express = require('express');
var fs = require('fs');

//test include desc file
eval(fs.readFileSync('core/desc/room_desc.js')+'');
console.log(ROOM)




//simple server for client static files (everything in /client is visible)
var app = express();
app.use(express.static(__dirname + '/client'));
app.listen(process.env.PORT || 3000);




//test for get request at server/whatsyourname
app.get('/whatsyourname', function(req,res) {
    res.send("george abitbol")
})

//test for get request with parameters at server/test?test=link
var test = {
    'mario' : 'peach',
    'link' : 'zelda'
}
app.get('/test', function(req,res) {
    res.send(test[req.query.test])
})

