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
    npm run install
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
            "id": "20001",
            "key": "PROJ-2",
            "project": "Project Alpha",
            "isResolved": false,
            "createdDate": "2024-03-01T10:00:10.325+0700",
            "resolutionDate": null,
            "timeSpent": null,
            "status": "In Progress"
          },
          {
            "id": "20000",
            "key": "PROJ-1",
            "project": "Project Alpha",
            "isResolved": false,
            "createdDate": "2024-03-01T09:50:29.586+0700",
            "resolutionDate": null,
            "timeSpent": null,
            "status": "In Progress"
          }
        ]
      },
      {
        "displayName": "Jamie Smith",
        "accountId": "712020:efgh5678-a307-4981-82f1-3dadcad206fc",
        "accountType": "atlassian",
        "active": true,
        "issues": [
          {
            "id": "20002",
            "key": "PROJ-3",
            "project": "Project Alpha",
            "isResolved": true,
            "createdDate": "2024-03-02T11:15:04.644+0700",
            "resolutionDate": "2024-03-02T11:45:20.065+0700",
            "timeSpent": 1820.421,
            "status": "Completed"
          }
        ]
      }
    ]
   ```
## Run globally
If you wanna run this script globally, just simply run this command first in the project directory
```bash
sudo npm install -g .
```
Now you can run this program every where, just simply by typing this
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
```

    
## Authors

- [@andrianramadan](https://www.github.com/andrianramadan)

**Made with ❤️ by Aan**
