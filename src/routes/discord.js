const router = require('express').Router();
const Github = require('../services/github');
const Tasks = require('../services/tasks');
const Tracker = require('../services/tracker');

router.get('/', (req, res) => {
  const username = req.query.username;
  const discord_room = 9824342893;

  Tracker.addHuman({ username, discord_room }, (done) => {
    if (!done) return res.json({ success: false });

    Tasks.assignTask(username, (task) => {
      console.log(task);
      if (!task) {
        console.log('no tasks to do...');
        return done(false);
      }

      Tracker.scheduleUserTask(username, task);
    })
  });
})

router.get('/example', async (req, res) => {
  const x = await Github.listColumns();
  console.log(x);
});

module.exports = router;