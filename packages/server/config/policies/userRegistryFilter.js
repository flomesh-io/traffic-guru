module.exports = async (ctx, next) => {
  const data = ctx.request.body;
  const params = ctx.params;
  const user = await strapi.query('user', 'users-permissions').findOne({
    email: data.email,
  });
  if (user == null || !data.email) {
    // Modify anything other than the email
  } else if (user.id == params.id) {
    // Skip the current user
  } else {
    throw new Error('The email address cannot be duplicated');
  }
  await next();
};
