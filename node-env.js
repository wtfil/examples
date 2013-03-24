/**
 * Execution content demo
 * Run "node node-env.js"
 *
 * @see http://127.0.0.1:3000
 */
var domain = require('domain'),
    http = require('http');

http.createServer(function (req, res) {
    var reqDomain = domain.create();
    
    // error handler for one request
    reqDomain.on('error', function (err) {
        res.writeHead(500);
        res.end(err.stack);
        res.on('close', function () {
            reqDomain.dispose();
        })
    });

    reqDomain.run(function () {
        // creating magic
        process.domain.state = {
            req: req,
            res: res
        };
        
        // no arguments given
        someFunction();
    });
}).listen(3000);

function someFunction() {
    var res = process.domain.state.res;
    
    // Random error
    if (Math.random() > 0.5) {

        // async error
        process.nextTick(function () {
            throw new Error('Test error');
        });

    } else {
        res.end('ok');
    }

}
