import axios from 'axios';

interface JiraConfig {
  jiraApiUrl: string;
  jiraApiToken: string;
  jiraEmail: string;
}

interface Option {
  since: string;
  until: string;
}

interface User {
  displayName: string;
  accountId: string;
  accountType: string;
  active: boolean;
  emailAddress: string;
  issues?: Issue[];
}

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

interface IssueStatusHistory {
  created: string;
  status: string;
}

export default class JiraClient {
  private readonly authToken: string;
  constructor(
    private readonly config: JiraConfig,
    private readonly option: Option
  ) {
    this.authToken = Buffer.from(
      `${config.jiraEmail}:${config.jiraApiToken}`
    ).toString('base64');
  }

  /**
   * Retrieves all issues from Jira based on the assigneeAccountId.
   *
   * @param assigneeAccountId
   * @param startAt
   * @param maxResults
   * @returns {Promise<any>} List of issues.
   */
  public async getIssues(
    assigneeAccountId: string,
    startAt: number = 0,
    maxResults: number = 50
  ): Promise<any> {
    try {
      const response = await axios.get(
        `${this.config.jiraApiUrl}/search?jql=created>=${this.option.since} and created<=${this.option.until} and assignee=${assigneeAccountId}&startAt=${startAt}&maxResults=${maxResults}`,
        {
          headers: {
            Authorization: `Basic ${this.authToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Retrieves a list of users from the Jira.
   * Only users with the account type 'atlassian' are included in the result.
   *
   * @returns {Promise<User[]>} List of users.
   */
  public async getUsers(): Promise<User[]> {
    const response = await axios.get(`${this.config.jiraApiUrl}/users`, {
      headers: {
        Authorization: `Basic ${this.authToken}`,
      },
    });

    return response.data
      .filter((user: User) => user.accountType === 'atlassian')
      .map((user: User) => {
        return {
          displayName: user.displayName,
          accountId: user.accountId,
          accountType: user.accountType,
          active: user.active,
          emailAddress: user.emailAddress,
        };
      });
  }

  // public async function issueStatusHistory(issueId: string): Promise<IssueStatusHistory[]>{
  //   return axios.get(`${this.config.jiraApiUrl}/issue/${issueId}/changelog`, {
  //     headers: {
  //       Authorization: `Basic ${this.authToken}`,
  //     },
  //   });

  // }

  /**
   * Retrieves the issue status history.
   *
   * @param issueId
   * @returns {Promise<IssueStatusHistory[]>} List of issue status history.
   */
  public async getIssueStatusHistory(
    issueId: string
  ): Promise<IssueStatusHistory[]> {
    const response = await axios.get(
      `${this.config.jiraApiUrl}/issue/${issueId}/changelog`,
      {
        headers: {
          Authorization: `Basic ${this.authToken}`,
        },
      }
    );

    const status: IssueStatusHistory[] = [];

    response.data.values.forEach((log: any) => {
      const items = log.items;
      items.forEach((item: any) => {
        if (item.fieldId === 'status') {
          status.push({
            created: log.created,
            status: item.toString,
          });
        }
      });
    });

    return status;
  }
}
