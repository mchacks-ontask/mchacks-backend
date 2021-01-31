const example_tasks = {
  3423: { task_name: "Do this and that", estimation : 1, assignee: null, description: 'i need this done' },
  32131: { task_name: "And then this for that?", estimation : 2, assignee: null, description: 'i need this adawdad' }
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