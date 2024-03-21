export interface Stage {
    createToInProgress: number;
    inProgressToInReview: number;
    inReviewToDone: number;
    createToInReview: number;
    createToDone: number;
}

export interface Issue {
    id: string;
    key: string;
    project: string;
    summary: string;
    priority: string;
    isResolved: boolean;
    inProgressAt: string | null;
    inReviewAt: string | null;
    createdAt: string;
    resolvedAt: string;
    status: string;
    estimatedStoryPoint: number;
    stage: Stage;
}

export interface StatusHistory {
    created: string;
    status: "In Progress" | "In Review" | "Done" | "To Do";
}