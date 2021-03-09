# Table of Content

- [Table of Content](#table-of-content)
  - [1. About The Project](#1-about-the-project)
  - [2. Folder Structures](#2-folder-structures)
  - [3. Libraries & Frameworks](#3-libraries--frameworks)
  - [4. Installation & Set Up](#4-installation--set-up)

## 1. About The Project
 The system consists of a creator of navedex's. [This was developed as a teamnave back-end challenge](https://github.com/naveteam/back-end-challenge).
## 2. Folder Structures

```bash
├── src                                                             # Source files
|   ├── config                                                      # Project configurations: auth and mailer
|   ├── database                                                    # Database configuration
|   |   └── migrations                                              # Store migrations
|   ├── error                                                       # Error class
|   ├── lib                                                         # Nodemailer lib
|   ├── middleware                                                  # Auth middleware
|   ├── modules
|   |   └── modules
|   |       ├── navers
|   |       ├── projects
|   |       ├── sessions
|   |       └── users
|   └── views                                                       # Mailer layouts
└── tests                                                           # Tests files
    ├── navers
    ├── projects
    ├── sessions
    └── users

```

## 3. Libraries & Frameworks

| Name                                                     | Description                                                            |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Express](https://github.com/expressjs/express)          | Fast, unopinionated, minimalist web framework for node                 |
| [KnexJS](http://knexjs.org/)                             | A SQL Query Builder for Javascript
| [Nodemon](https://nodemon.io/)|Nodemon is a tool that helps develop node.js based applications by   automatically restarting the node application when file changes in the directory are detected.                                      |
| [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)| An implementation of JSON Web Tokens.                                 |
| [Nodemailer](https://nodemailer.com/)                    | A module for Node.js applications to allow easy as cake email sending. |
| [Jest](https://jestjs.io/)                               | A delightful JavaScript Testing Framework with a focus on simplicity.  |

## 4. Installation & Set Up

1. Clone this repository

```bash
  git clone https://github.com/BrunoYTanaka/navedex-api.git
```

2. Enter the repository folder and install the dependencies

```bash
   yarn install or npm install
```
3. Run migrations

```bash
  yarn migration:run or npm run migration:run
```
4. Start application on port 3000

```bash
  yarn dev or npm run dev
```