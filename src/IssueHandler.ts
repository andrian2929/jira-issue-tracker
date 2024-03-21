import JiraClient from "./JiraClient";
import {Issue, Stage, StatusHistory} from "./types/Issue";
import {User} from "./types/User";

export default class IssueHandler {
    constructor(private jiraClient: JiraClient) {
    }

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

                        const estimatedStoryPointField = `customfield_${this.jiraClient.config.storyPointCustomFieldId}`;

                        issues.push({
                            id: issue.id,
                            key: issue.key,
                            project: issue.fields.project.name,
                            summary: issue.fields.summary,
                            priority: issue.fields.priority.name,
                            isResolved: !!issue.fields.resolution,
                            inProgressAt: inProgressTimestamp,
                            inReviewAt: inReviewTimestamp,
                            createdAt: issue.fields.created,
                            resolvedAt: issue.fields.resolutiondate,
                            status: issue.fields.status.name,
                            estimatedStoryPoint: issue.fields[estimatedStoryPointField],
                            stage
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

        for (const user of users) {
            user.issues = await this.processIssues(user.accountId);
            user.averageStageDuration = this.countAverageStageDuration(user.issues);
        }

        return users;
    }

    private getStage(
        issue: any,
        statusHistory: StatusHistory[],
    ): Stage {
        const timestamp = {
            inProgress:
                this.getStatusTimestamp("In Progress", statusHistory)?.created || null,
            inReview:
                this.getStatusTimestamp("In Review", statusHistory)?.created || null,
            done: issue.fields.resolutiondate,
            created: issue.fields.created,
        };

        return {
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

    /** Get timestamp for specified status.
     *
     * @param status
     * @param statusHistory
     * @private
     */
    private getStatusTimestamp(
        status: "In Progress" | "In Review",
        statusHistory: StatusHistory[],
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

    /**
     * Count the average stage duration.
     *
     *
     * @param issues
     * @private
     */
    private countAverageStageDuration(issues: Issue[]): Stage {
        const stageDurationCount = {
            createToInProgress: 0,
            inProgressToInReview: 0,
            inReviewToDone: 0,
            createToInReview: 0,
            createToDone: 0
        };

        issues.forEach((issue) => {
            const stage = issue.stage;
            stageDurationCount.createToInProgress += stage.createToInProgress;
            stageDurationCount.inProgressToInReview += stage.inProgressToInReview;
            stageDurationCount.inReviewToDone += stage.inReviewToDone;
            stageDurationCount.createToInReview += stage.createToInReview;
            stageDurationCount.createToDone += stage.createToDone;
        });

        const totalIssue = issues.length;

        return {
            createToInProgress: Math.floor(stageDurationCount.createToInProgress / totalIssue),
            inProgressToInReview: Math.floor(stageDurationCount.inProgressToInReview / totalIssue),
            inReviewToDone: Math.floor(stageDurationCount.inReviewToDone / totalIssue),
            createToInReview: Math.floor(stageDurationCount.createToInReview / totalIssue),
            createToDone: Math.floor(stageDurationCount.createToDone / totalIssue),
        }
    }
}
