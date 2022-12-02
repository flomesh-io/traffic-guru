module.exports = ({ env }) => ({
  host: env('HOST', '::'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'a42132e09461e18dfbf7f46fcd2b9acd'),
    },
  },
  cron: {
    enabled: true,
  },
});
