const http = require("http")

http.createServer(function(req,res){
	res.write("on my way to become a full stack engineer");
	res.end()

}).listen(3000)

console.log("server listening at port 3000")
