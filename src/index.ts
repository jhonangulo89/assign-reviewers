import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    // Obtiene los inputs definidos en el action.yml
    const name = core.getInput('name');
    core.info(`Hello, ${name}!`);

    // Accede a datos del evento de GitHub
    const context = github.context;
    core.info(`Triggered by: ${context.eventName}`);
  } catch (error) {
    core.setFailed(`Action failed with error: ${(error as Error).message}`);
  }
}

run();
