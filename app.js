const http = require("http");

http
  .createServer(function (req, res) {
    res.write("Best ADC EUW");
    res.end();
  })
  .listen(3000);

console.log("server listening at port 3000");
