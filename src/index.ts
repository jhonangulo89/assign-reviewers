import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const token = core.getInput('github-token')
    const chapterLead = core.getInput('chapter-lead') || ''
    const technicalLeads = core.getInput('technical-leads') || ''
    const octokit = github.getOctokit(token)
    const context = github.context
    const reviewersList = technicalLeads
      .split(',')
      .map((user) => user.trim())
      .filter(Boolean)

    if (context.payload.pull_request) {
      const pullRequest = context.payload.pull_request
      const branch = pullRequest.base.ref // Target branch of the PR

      const reviewers = {
        main: [chapterLead, ...reviewersList],
        testing: [chapterLead, ...reviewersList],
        staging: [chapterLead, ...reviewersList]
      }

      // Filter out the PR author so they are not assigned as a reviewer
      const author = pullRequest.user.login
      const reviewersToAssign: string[] = reviewers[branch as keyof typeof reviewers]?.filter((reviewer: string) => reviewer !== author) || []

      if (reviewersToAssign && reviewersToAssign.length > 0) {
        // Assign reviewers to the PR
        await octokit.rest.pulls.requestReviewers({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: pullRequest.number,
          reviewers: reviewersToAssign
        })

        console.log(`Reviewers assigned: ${reviewersToAssign.join(', ')}`)
      } else {
        console.log(`No reviewers configured for the branch: ${branch} or the author is already a reviewer.`)
      }

      // Assign only the author as Assignee
      const assignees = [author]

      await octokit.rest.issues.addAssignees({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pullRequest.number,
        assignees: assignees
      })

      console.log(`Assignee assigned: ${assignees.join(', ')}`)
    } else {
      console.log('Not a pull_request event')
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${(error as Error).message}`);
  }
}

run();
