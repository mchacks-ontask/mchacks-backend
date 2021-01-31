
const chalk = require('chalk');

module.exports.makeGlobalLogger = (name, msg, type) => {
	switch (type) {
		case 'error':
			console.log(
				chalk.bold.red(`${new Date().toLocaleTimeString()} - [${name}] ${msg}`),
			);
			break;
		case 'success':
			console.log(
				chalk.green(`${new Date().toLocaleTimeString()} - [${name}] ${msg}`),
			);
			break;
		case 'warning':
			console.log(
				chalk.orange(`${new Date().toLocaleTimeString()} - [${name}] ${msg}`),
			);
			break;
		case 'info':
			console.log(
				chalk.magenta(`${new Date().toLocaleTimeString()} - [${name}] ${msg}`),
			);
			break;
		case 'socket':
			console.log(
				chalk.bold.cyan(
					`${new Date().toLocaleTimeString()} - [${name}] ${msg}`,
				),
			);
			break;
		case 'cron':
			console.log(
				chalk.blue(
					`${new Date().toLocaleTimeString()} - [${name}] ${msg}`,
				),
			);
			break;
	}
};