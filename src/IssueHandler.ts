import JiraClient from "./JiraClient";

interface Issue {
  id: string;
  key: string;
  project: string;
  isResolved: boolean;
  inProgressAt: string | null;
  inReviewAt: string | null;
  createdAt: string;
  resolvedAt: string;
  status: string;
  stage: {
    createToInProgress: number;
    inProgressToInReview: number;
    inReviewToDone: number;
    createToInReview: number;
    createToDone: number;
    averageDuration: number;
  };
}

interface IssueStatusHistory {
  created: string;
  status: "In Progress" | "In Review" | "Done" | "To Do";
}

interface User {
  displayName: string;
  accountId: string;
  accountType: string;
  active: boolean;
  emailAddress: string;
  issues?: Issue[];
}

export default class IssueHandler {
  constructor(private jiraClient: JiraClient) {}

  /**
   * Retrieves and processes issues assigned to a specific account ID.
   *
   * @param {string} assigneeAccountId
   * @returns {Promise<Issue[]>}
   */
  private async processIssues(assigneeAccountId: string): Promise<Issue[]> {
    const issues: Issue[] = [];

    let startAt = 0;
    const maxResults = 50;

    while (true) {
      try {
        const response = await this.jiraClient.getIssues(
          assigneeAccountId,
          startAt,
          maxResults,
        );

        if (response.issues.length === 0) break;

        for (const issue of response.issues) {
          if (issue.fields.resolutiondate) {
            const statusHistory = await this.jiraClient.getIssueStatusHistory(
              issue.id,
            );
            const stage = this.getStage(issue, statusHistory);

            const inProgressTimestamp =
              this.getStatusTimestamp("In Progress", statusHistory)?.created ||
              null;

            const inReviewTimestamp =
              this.getStatusTimestamp("In Review", statusHistory)?.created ||
              null;

            issues.push({
              id: issue.id,
              key: issue.key,
              project: issue.fields.project.name,
              isResolved: !!issue.fields.resolution,
              inProgressAt: inProgressTimestamp,
              inReviewAt: inReviewTimestamp,
              createdAt: issue.fields.created,
              resolvedAt: issue.fields.resolutiondate,
              status: issue.fields.status.name,
              stage,
            });
          }
        }

        startAt += maxResults;
      } catch (error) {
        console.error(error);
      }
    }

    return issues;
  }

  /**
   * Retrieves users from Jira and processes their issues.
   *
   * @returns {Promise<User[]>}
   */
  public async execute(): Promise<User[]> {
    const users = await this.jiraClient.getUsers();

    for (const user of users)
      user.issues = await this.processIssues(user.accountId);

    return users;
  }

  private getStage(
    issue: any,
    statusHistory: IssueStatusHistory[],
  ): Issue["stage"] {
    const timestamp = {
      inProgress:
        this.getStatusTimestamp("In Progress", statusHistory)?.created || null,
      inReview:
        this.getStatusTimestamp("In Review", statusHistory)?.created || null,
      done: issue.fields.resolutiondate,
      created: issue.fields.created,
    };

    const stage = {
      createToInProgress: this.countTimeDifference(
        timestamp.created,
        timestamp.inProgress,
      ),
      inProgressToInReview: this.countTimeDifference(
        timestamp.inProgress,
        timestamp.inReview,
      ),
      inReviewToDone: this.countTimeDifference(
        timestamp.inReview,
        timestamp.done,
      ),
      createToInReview: this.countTimeDifference(
        timestamp.created,
        timestamp.inReview,
      ),
      createToDone: this.countTimeDifference(timestamp.created, timestamp.done),
    };

    const averageDuration = this.countStageAverage(stage);

    return { ...stage, averageDuration };
  }

  private countStageAverage(
    stage: Omit<Issue["stage"], "averageDuration">,
  ): number {
    const timeDifferences = Object.values(stage);
    const sum = timeDifferences.reduce((acc, val) => acc + val, 0);
    return sum / timeDifferences.length;
  }

  /**
   * Count the time difference between two dates in second.
   *
   * @param start
   * @param end
   * @private
   */
  private countTimeDifference(
    start: string | null,
    end: string | null,
  ): number {
    if (start === null || end === null) return 0;

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    return Math.floor((endTime - startTime) / 1000);
  }

  /**
   *
   * @param status
   * @param statusHistory
   * @private
   */
  private getStatusTimestamp(
    status: "In Progress" | "In Review",
    statusHistory: IssueStatusHistory[],
  ) {
    let index: number;

    switch (status) {
      case "In Progress":
        index = statusHistory.findIndex(
          (status) => status.status === "In Progress",
        );
        break;
      case "In Review":
        index = statusHistory.findLastIndex(
          (status) => status.status === "In Review",
        );
        break;
      default:
        return null;
    }

    return index > -1 ? statusHistory[index] : null;
  }
}
