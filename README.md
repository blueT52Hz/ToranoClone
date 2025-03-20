# Get Started
## 1. Download Node.js

[Download Link](https://nodejs.org/en)

Open the VS Code Terminal and run the script:
```
npm -v
```

If you encounter an error like `cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.`, follow these steps:


1. Open Windows PowerShell.

2. Run the following script:

```
Get-ExecutionPolicy
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Type Yes to confirm the change.

## 2. Clone this repository

## 3. Open the VS Code:

Navigate to the project root, open the Terminal and run this script:

```
npm install
npm run dev
```

