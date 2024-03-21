import axios from "axios"
import {JiraConfig} from "./types/Config";
import {Option} from "./types/Option";
import {User} from "./types/User";
import {StatusHistory} from "./types/Issue";

export default class JiraClient {
    private readonly authToken: string;

    constructor(
        private readonly jiraConfig: JiraConfig,
        private readonly option: Option,
    ) {

        this.authToken = Buffer.from(
            `${jiraConfig.jiraEmail}:${jiraConfig.jiraApiToken}`,
        ).toString("base64");
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
        maxResults: number = 50,
    ): Promise<any> {
        try {
            let jql = `(created>=${this.option.since} and created<=${this.option.until}) and assignee=${assigneeAccountId}`;
            if (this.option.type.toLowerCase() === "bug") jql += ` and issueType="Bug"`;

            const response = await axios.get(
                `${this.config.jiraApiUrl}/search?jql=${jql}&startAt=${startAt}&maxResults=${maxResults}`,
                {
                    headers: {
                        Authorization: `Basic ${this.authToken}`,
                    },
                },
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
            .filter((user: User) => user.accountType === "atlassian" && user.active)
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

    /**
     * Retrieves the issue status history.
     *
     * @param issueId
     * @returns {Promise<StatusHistory[]>} List of issue status history.
     */
    public async getIssueStatusHistory(
        issueId: string,
    ): Promise<StatusHistory[]> {
        const response = await axios.get(
            `${this.config.jiraApiUrl}/issue/${issueId}/changelog`,
            {
                headers: {
                    Authorization: `Basic ${this.authToken}`,
                },
            },
        );

        const status: StatusHistory[] = [];

        response.data.values.forEach((log: any) => {
            const items = log.items;
            items.forEach((item: any) => {
                if (item.fieldId === "status") {
                    status.push({
                        created: log.created,
                        status: item.toString,
                    });
                }
            });
        });

        return status;
    }


    /**
     * Getter for the Jira config.
     */
    public get config(): JiraConfig {
        return this.jiraConfig;
    }
}
