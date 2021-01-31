const { Octokit } = require("@octokit/rest");

class Github {
  constructor() {
    this.app = new Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN
    });

    this.columns = [];
  }

  async listProjects() {
    const projects = await this.app.projects.listForRepo({
      owner: 'mchacks-ontask',
      repo: 'snake-game'
    });

    console.log(projects);
  }

  async listColumns() {
    logit('Github', 'Listing columns for github', 'info');
    
    const columns = await this.app.projects.listColumns({
      project_id: process.env.GITHUB_PROJECT_ID
    });

    if (columns.status === 200) {
      this.columns = columns.data;
    }
  }
}

module.exports = new Github();