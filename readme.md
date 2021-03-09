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
| [NextJS](https://nextjs.org/)                            | The React Framework for Production.                                    |
| [NextAuth](https://next-auth.js.org/)                    | Authentication for Next.js.                                            |
| [ReactJS](https://reactjs.org/)                          | A JavaScript library for building user interfaces.                     |
| [Axios](https://redux.js.org/)                           | A Predictable State Container for JS Apps.                             |
| [Styled Components](https://styled-components.com/)      | Visual primitives for the component age.                               |

## 4. Installation & Set Up

1. Install project dependencies

```bash
  yarn install or npm install
```

2. Start the development server

```bash
  yarn dev or npm run dev
```
