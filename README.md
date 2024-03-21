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
        "accountId": "70121:abcd1234-101e-4ffc-82cc-db88059b80ad",
        "accountType": "atlassian",
        "active": true,
        "emailAddress": "alex.johnson@example.com",
        "issues": [
          {
            "id": "10007",
            "key": "PROJ-1",
            "project": "Project Alpha",
            "isResolved": true,
            "inProgressAt": null,
            "inReviewAt": null,
            "createdAt": "2024-03-14T09:04:24.703+0700",
            "resolvedAt": "2024-03-14T09:48:34.739+0700",
            "status": "Done",
            "stage": {
              "createToInProgress": 0,
              "inProgressToInReview": 0,
              "inReviewToDone": 0,
              "createToInReview": 0,
              "createToDone": 2650,
              "averageDuration": 530
            }
          },
          {
            "id": "10006",
            "key": "PROJ-2",
            "project": "Alpha Project",
            "isResolved": true,
            "inProgressAt": "2024-03-07T14:53:03.158+0700",
            "inReviewAt": "2024-03-07T15:39:58.973+0700",
            "createdAt": "2024-03-07T14:52:40.531+0700",
            "resolveAt": "2024-03-07T15:45:12.764+0700",
            "status": "Done",
            "stage": {
              "createToInProgress": 22,
              "inProgressToInReview": 2815,
              "inReviewToDone": 313,
              "createToInReview": 2838,
              "createToDone": 3152,
              "averageDuration": 1828
            }
          }
        ]
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
  -h, --help           display help for command
  -t, --type  <type>   Filter the type of issue, default always Bug
```

## Authors

- [@andrian2929](https://www.github.com/andrian2929)

**Made with ❤️ by Aan**
