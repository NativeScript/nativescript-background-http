var http = require("http");
var fs = require("fs");

function start(port, logger) {
  var outDir = __dirname + "/uploads/";
  var server = http.createServer(function(request, response) {
    console.log("WTF?");
    try {
      var Throttle = require("stream-throttle").Throttle;

      var fileName = request.headers["file-name"];
      if (logger) {
        logger.log(request.method + "Request! Content-Length: " + request.headers["content-length"] + ", file-name: " + fileName);
        logger.dir(request.headers);
      }

      var out = outDir + "upload-" + new Date().getTime() + "-" + fileName;
      if (logger) {
        logger.log("Output in: " + out);
      }

      var total = request.headers["content-length"];
      var current = 0;

      var shouldFail = request.headers["should-fail"];

      request.pipe(new Throttle({ rate: 1024 * 2048 })).pipe(fs.createWriteStream(out, { flags: 'w', encoding: null, fd: null, mode: 0666 }));

      request.on('data', function(chunk) {
        current += chunk.length;
        
        if (shouldFail && (current / total > 0.25)) {
          if (logger) {
            console.log("Error ");
          }
          var body = "Denied!";
          response.writeHead(408, "Die!", { "Content-Type": "text/plain", "Content-Length": body.length, "Connection": "close" });
          response.write(body);
          response.end();
          if (logger) {
            console.log("Terminated with error: [" + out + "]: " + current + " / " + total + "  " + Math.floor(100 * current / total) + "%");
          }
        } else {
          if (logger) {
            console.log("Data [" + out + "]: " + current + " / " + total + "  " + Math.floor(100 * current / total) + "%");
          }
        }
      });

      request.on('end', function () {
        setTimeout(function() {
          if (logger) {
            console.log("Done (" + out + ")");
          }
          var body = "Upload complete!";
          response.writeHead(200, "Done!", { "Content-Type": "text/plain", "Content-Length": body.length });
          response.write(body);
          response.end();
        }, 10000);
      });

      if (logger) {
        request.on('error', function(e) {
          console.log('error!');
          console.log(e);
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