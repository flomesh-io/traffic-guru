
module.exports = ({ env }) => ({
  connection: {
    client: env('DATABASE_TYPE', 'mysql') == 'default' ? 'mysql' : env('DATABASE_TYPE', 'mysql'),
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapiV4'),
      user: env('DATABASE_USERNAME', 'mysql'),
      password: env('DATABASE_PASSWORD', '123456'),
      ssl: env.bool('DATABASE_SSL_SELF') ? {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
      } : null,
    },
    debug: false,
    pool: {
      max: 100
    }
  },
});