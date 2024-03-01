import JiraClient from './JiraClient';

interface Issue {
  id: string;
  key: string;
  project: string;
  isResolved: boolean;
  createdDate: string;
  resolutionDate: string;
  timeSpent: number | null;
  status: string;
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
          maxResults
        );

        if (response.issues.length === 0) break;

        response.issues.forEach((issue: any) => {
          const timeSpent = this.getTimeSpent(
            issue.fields.created,
            issue.fields.resolutiondate
          );

          issues.push({
            id: issue.id,
            key: issue.key,
            project: issue.fields.project.name,
            isResolved: issue.fields.resolution !== null,
            createdDate: issue.fields.created,
            resolutionDate: issue.fields.resolutiondate,
            timeSpent: timeSpent,
            status: issue.fields.status.name,
          });
        });

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

  /**
   * Calculates the time spent between the created date and the resolution date.
   *
   * @param {string} createdDate
   * @param {string|null} resolutionDate
   * @returns {number|null} The spent time in seconds, or null
   *
   */
  private getTimeSpent(
    createdDate: string,
    resolutionDate: string | null
  ): number | null {
    if (!resolutionDate) return null;

    const created = new Date(createdDate);
    const resolution = new Date(resolutionDate);

    return (resolution.getTime() - created.getTime()) / 1000;
  }
}
