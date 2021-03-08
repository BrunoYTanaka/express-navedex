module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/test.sqlite',
    },
    migrations: {
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
    pool:{
      afterCreate: (conn, cb) =>{
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  },
  development: {
      client: 'sqlite3',
      connection: {
          filename: './src/database/db.sqlite',
      },
      migrations: {
          directory: './src/database/migrations',
      },
      useNullAsDefault: true,
      pool:{
        afterCreate: (conn, cb) =>{
          conn.run('PRAGMA foreign_keys = ON', cb);
        }
      }
  }
}

