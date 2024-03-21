import {Issue, Stage} from "./Issue";

export interface User {
    displayName: string;
    accountId: string;
    accountType: string;
    active: boolean;
    emailAddress: string;
    issues?: Issue[];
    averageStageDuration: Stage | null;
}