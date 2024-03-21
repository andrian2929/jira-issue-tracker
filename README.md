## Introduction

Command line-based tools for tracking issue for each user in Jira

## Requirement

- Node 20 or higher

## Usage

1. Set up your jira configuration by copying config.example.json to config.json:
   ```bash
    cp config.example.json config.json
   ```
2. Install all package and dependencies.
   ```bash
    npm install
   ```
3. Build the project
    ```bash
    npm run build
    ```
4. Run the script
    ```bash
    node dist/Main.js --since 2023-04-04 --until 2024-03-03
    ```
5. This tool will generate json file, output.json
   Example:
   ```json
    [
      {
        "displayName": "Alex Johnson",
        "accountId": "70121:608a738c-101e-4ffc-82cc-db88059b80ad",
        "accountType": "atlassian",
        "active": true,
        "emailAddress": "alex.johnson@example.com",
        "issues": [
          {
            "id": "10008",
            "key": "KAN-9",
            "project": "My Kanban Project",
            "summary": "Complete the task at hand",
            "priority": "Medium",
            "isResolved": true,
            "inProgressAt": "2024-03-21T22:03:54.989+0700",
            "inReviewAt": "2024-03-21T22:04:01.515+0700",
            "createdAt": "2024-03-21T22:03:28.724+0700",
            "resolvedAt": "2024-03-21T22:04:07.173+0700",
            "status": "Done",
            "estimatedStoryPoint": 1.5,
            "stage": {
              "createToInProgress": 26,
              "inProgressToInReview": 6,
              "inReviewToDone": 5,
              "createToInReview": 32,
              "createToDone": 38
            }
          },
          {
            "id": "10007",
            "key": "KAN-8",
            "project": "My Kanban Project",
            "summary": "Address this bug",
            "priority": "Medium",
            "isResolved": true,
            "inProgressAt": null,
            "inReviewAt": null,
            "createdAt": "2024-03-14T09:04:24.703+0700",
            "resolvedAt": "2024-03-14T09:48:34.739+0700",
            "status": "Done",
            "estimatedStoryPoint": null,
            "stage": {
              "createToInProgress": 0,
              "inProgressToInReview": 0,
              "inReviewToDone": 0,
              "createToInReview": 0,
              "createToDone": 2650
            }
          },
          {
            "id": "10006",
            "key": "KAN-7",
            "project": "My Kanban Project",
            "summary": "Identify this song",
            "priority": "Medium",
            "isResolved": true,
            "inProgressAt": "2024-03-07T14:53:03.158+0700",
            "inReviewAt": "2024-03-07T15:39:58.973+0700",
            "createdAt": "2024-03-07T14:52:40.531+0700",
            "resolvedAt": "2024-03-07T15:45:12.764+0700",
            "status": "Done",
            "estimatedStoryPoint": null,
            "stage": {
              "createToInProgress": 22,
              "inProgressToInReview": 2815,
              "inReviewToDone": 313,
              "createToInReview": 2838,
              "createToDone": 3152
            }
          }
        ],
        "averageStageDuration": {
          "createToInProgress": 16,
          "inProgressToInReview": 940,
          "inReviewToDone": 106,
          "createToInReview": 956,
          "createToDone": 1946
        }
      },
      {
        "displayName": "Jamie Smith",
        "accountId": "712020:66033b0e-a307-4981-82f1-3dadcad206fc",
        "accountType": "atlassian",
        "active": true,
        "issues": [],
        "averageStageDuration": {
          "createToInProgress": null,
          "inProgressToInReview": null,
          "inReviewToDone": null,
          "createToInReview": null,
          "createToDone": null
        }
      }
    ]
   ```

## Run globally

If you want to run this script globally, just simply run this command first in the project directory

```bash
sudo npm install -g .
```

Now you can run this program everywhere, just simply by typing this

```bash
issue-tracker --since 2023-04-04 --until 2024-03-03
```

## Help

```bash
Usage: Jira issue tracker

Options:
  -s, --since <since>  Since date
  -u, --until <until>  Until date
  -t, --type  <type>   Issue type (default: "all")
  -h, --help           display help for command
```

## Authors

- [@andrian2929](https://www.github.com/andrian2929)

**Made with ❤️ by Aan**
