const example_tasks = {
  3423: { task_name: "Create random boxes around the map", estimation : 1, assignee: null, description: 'We need a few random boxes' },
  32131: { task_name: "Fix the mcgill website", estimation : 2, assignee: null, description: 'Its broken right now' },
  2222: { task_name: "A third task.. idk what to put tho", estimation : 2, assignee: null, description: 'Yeah yeah.' }
}

class Tasks {
  constructor(tasks) {
    this.tasks = tasks;
  }

  assignTask(username, done) {
    let found = false;
    let index = 0;
    
    const tasksArr = Object.entries(this.tasks);

    while(!found) {
      const [id, current] = tasksArr[index];
      if (!current.assignee) {
        logit('Tasks', `Assigning task ${id} to username ${username}`, 'info');
        found = true;
        this.tasks[id].assignee = username;
        return done(current);
      }

      index++;
    }

    return done(false);
  }
}

module.exports = new Tasks(example_tasks);