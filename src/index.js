const app = require("express")();
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
const path = require('path');
dotenv.config({ path : path.resolve(__dirname, '..', 'dot.env') });

const { makeGlobalLogger } = require("./services/logger");
global.logit = (name, msg, type) => {
	makeGlobalLogger(name, msg, type);
};

logit('SERVER', 'Server started ... brrr hold 💎👐', 'info');

// Initialization
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let server = require("http").createServer(app);
server.listen(process.env.SERVER_PORT || 3100);

app.use((req, res, next) => {
	//  Set CORS headers so that the React SPA is able to communicate with this server
  
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  
	res.setHeader(
	  "Access-Control-Allow-Methods",
	  "GET,POST,PUT,PATCH,DELETE,OPTIONS"
	);
  
	res.setHeader("Access-Control-Allow-Headers", ["Content-Type", "token"]);
	next();
});

app.use('/discord',   require('./routes/discord'));