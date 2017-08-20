var connect = require('connect'),
    port = 3001;

connect.createServer(connect.static(__dirname + '/public')).listen(port);
console.log('Listening on ' + port + '...');
console.log('Press Ctrl + C to stop.');