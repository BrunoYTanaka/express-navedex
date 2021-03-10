# Table of Content

- [Table of Content](#table-of-content)
  - [1. About The Project](#1-about-the-project)
  - [2. Folder Structures](#2-folder-structures)
  - [3. Libraries & Frameworks](#3-libraries--frameworks)
  - [4. Installation & Set Up](#4-installation--set-up)
  - [5. Routes](#5-routes)
  - [6. Postman](#6-postman)
## 1. About The Project
  The system consists of a creator of navedex's. [This was developed as a teamnave back-end challenge](https://github.com/naveteam/back-end-challenge).
## 2. Folder Structures

```bash
├── postman                                                         # Postman collection and env variables
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
| [Express](https://github.com/expressjs/express)          | Fast, unopinionated, minimalist web framework for node.                |
| [KnexJS](http://knexjs.org/)                             | A SQL Query Builder for Javascript.
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

5. Run test ( Optional )

```bash
  yarn test or npm run test
```

## 5. Routes
  For more info about the routes, access [challenge page](https://github.com/naveteam/back-end-challenge#funcionalidades) documentation api.

* User

  | Method |  Route     |    Description       |
  |--------|------------|----------------------|
  | POST   |  /users    |  Create a user       |

* Session

  | Method |  Route     |   Description        |
  |--------|------------|----------------------|
  | POST   |  /session  |  Create a session    |


* Naver

  | Method |        Route       |      Description     |
  |--------|--------------------|----------------------|
  | POST   | /navers            |  Create a naver      |
  | GET    | /navers/list       |  List all navers     |
  | GET    | /navers/:naverId   |  List one naver      |
  | DELETE | /navers/:naverId   |  Delete one naver    |
  | PUT    | /navers/:naverId   |  Update one naver    |

* Project

  | Method |        Route           |        Description     |
  |--------|------------------------|------------------------|
  | POST   | /projects              |  Create a project      |
  | GET    | /projects/list         |  List all projects     |
  | GET    | /projects/:projectId   |  List one project      |
  | DELETE | /projects/:projectId   |  Delete one project    |
  | PUT    | /projects/:projectId   |  Update one project    |


## 6. Postman

  You can configure the [postman](https://www.postman.com/) to test routes more easily. Inside the postman folder has the collection and env variable, import them and starting using. ( [how to import to postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-postman-data) )
