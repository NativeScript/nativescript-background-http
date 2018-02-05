var http = require("http");
var fs = require("fs");
var path = require("path");

function start(port, logger) {

  var outDir = path.join(__dirname, "uploads");
  var server = http.createServer(function(request, response) {
    try {
      var Throttle = require("stream-throttle").Throttle;

      var fileName = request.headers["file-name"];
      if (logger) {
        logger.log(request.method + "Request! Content-Length: " + request.headers["content-length"] + ", file-name: " + fileName);
        logger.dir(request.headers);
      }

      var out = path.join(outDir, "upload-" + new Date().getTime() + "-" + fileName);
      if (logger) {
        logger.log("Output in: " + out);
      }

      var total = request.headers["content-length"];
      var current = 0;

      var shouldFail = request.headers["should-fail"];

      // throttle write speed to 4MB/s
      request.pipe(new Throttle({ rate: 1024 * 4096 })).pipe(fs.createWriteStream(out, { flags: 'w', encoding: null, fd: null, mode: 0666 }));

      request.on('data', function(chunk) {
        current += chunk.length;
        
        if (shouldFail && (current / total > 0.25)) {
          if (logger) {
            logger.log("Error ");
          }
          var body = "Denied!";
          response.writeHead(408, "Die!", { "Content-Type": "text/plain", "Content-Length": body.length, "Connection": "close" });
          response.write(body);
          response.end();
          shouldFail = false;
          if (logger) {
            logger.log("Terminated with error: [" + out + "]: " + current + " / " + total + "  " + Math.floor(100 * current / total) + "%");
          }
        } else {
          if (logger) {
            logger.log("Data [" + out + "]: " + current + " / " + total + "  " + Math.floor(100 * current / total) + "%");
          }
        }
      });

      request.on('end', function () {
        setTimeout(function() {
          if (logger) {
            logger.log("Done (" + out + ")");
          }
          var body = "Upload complete!";
          response.writeHead(200, "Done!", { "Content-Type": "text/plain", "Content-Length": body.length });
          response.write(body);
          response.end();
        }, 1000);
      });

      if (logger) {
        request.on('error', function(e) {
          logger.log('error!');
          logger.log(e);
        });
      }
    } catch(e) {
      if (logger) {
        logger.log(e);
      }
      throw e;
    }
  });

  server.listen(port);
  if (logger) {
    logger.log("Server is listening on: " + port);
    logger.log("Uploads are saved to: " + outDir);
  }

  return {
    close: function() {
      server.close();
    }
  }
}
exports.start = start;

if (process.argv.length === 3) {
  var port = parseInt(process.argv[2]);
  start(port, console);
}
