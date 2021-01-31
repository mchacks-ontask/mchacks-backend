
const CronJob = require('cron').CronJob;

class Human {
  constructor() {
    this.username       = "";
    this.notes          = "";
    this.discord_room   = null;
    this.job;
  }
}

class Tracker {
  constructor() {
    this.humans = {};
  }

  createEmptyHuman() {
    return new Human;
  }

  initBaseHuman(data) {
    let newHuman = this.createEmptyHuman();

    logit('Tracker', `Creating human with name ${data.name}`, 'info');
    
    newHuman.name         = data.name;
    newHuman.discord_room = data.discord_room;
    newHuman.job;

    return newHuman;
  }


  addHuman(data, done) {
    // Check if human exists...
    if (this.humans[data.username]) {
      logit('Tracker', `Human is already at work.. who's the imposter?`, 'warning');
      return done(false);
    }

    logit('Tracker', `Adding human with username ${data.username}`, 'info');
    this.humans[data.username] = data;

    return done(true);
  }

  removeHuman(username) {
    if (!this.humans[username]) {
      logit('Tracker', `${username} was not in the system when trying to remove it.`, 'error');
      return;
    }

    logit('Tracker', `User with username ${username} has been removed.`, 'success');
    this.removeUserTask(username);
    delete this.humans[username];
  }

  calculateTimer(estimation) {
    switch(estimation) {
      case 1:
        return '* * * * *'
      case 2:
        return '*/2 * * * *'
      case 3:
        return '*/3 * * * *'
    }
  }

  scheduleUserTask(username, task) {
    this.humans[username].job = new CronJob(this.calculateTimer(task.estimation || 1), () => {
      logit('CRON', `Will send reminder every ${task.estimation} minutes`, 'cron');
    }, null, true, 'America/Los_Angeles');

    this.humans[username].job.start();
  }

  removeUserTask(username) {
    logit('CRON', `Ending user ${username} cron job.`, 'cron');
    this.humans[username].job?.stop();
  }
}

module.exports = new Tracker();