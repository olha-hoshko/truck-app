# truck-app
This UBER-like service for trucks allowes regular people to deliver their stuff and helps drivers to find loads. The application contains 2 roles: driver and shipper.

## Installation

After cloning this repo, make sure you have [node.js](https://nodejs.org/en/download/) installed in your PC. Open a folder with this project in a code editor, e.g. VS Code, then open a terminal and use a command

```bash
npm install
```

to install all needed modules.

## Usage

To run a server use a command

```bash
npm start
```
or

```bash
nodemon src/index.js
```

Also you need to create and connect to your own MongoDB cluster and change DATABASE_URL in .env file. The same goes to EMAIL and EMAIL_PASSWORD, which needed to send mails with forgotten passwords to users.

## Client

Client files are located in 'client' folder. Currently, there are pages only for login, registration and a page with a trucks list for a logged-in driver.
