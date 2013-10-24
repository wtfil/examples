/**
 * Execution context demo
 * Run "node node-env.js"
 *
 * @see http://127.0.0.1:3000
 */
var domain = require('domain'),
    http = require('http');

http.createServer(function (req, res) {
    // creating new domain
    var reqDomain = domain.create();
    
    // error handler for each request
    reqDomain.on('error', function (err) {
        res.writeHead(500);
        res.end(err.stack);
        res.on('close', function () {
            reqDomain.dispose();
        });
    });

    reqDomain.run(function () {
        // creating execution context
        process.domain.state = {
            req: req,
            res: res
        };
        
        // no arguments given
        setTimeout(someFunction, 1000);
    });
}).listen(3000);

// "req" "res" out of scope
function someFunction() {
    // getting "req" reference from domain
    var res = process.domain.state.res;
    
    // random error
    if (Math.random() > 0.5) {

        // async error
        process.nextTick(function () {
            throw new Error('Test error');
        });

    } else {
        res.end('ok');
    }

}
