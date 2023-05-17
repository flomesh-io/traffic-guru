'use strict';

const { strict: assert } = require('assert');
const { has, prop } = require('lodash/fp');

const { UnauthorizedError } = require('@strapi/utils').errors;

const INVALID_STRATEGY_MSG =
  'Invalid auth strategy. Expecting an object with properties {name: string, authenticate: function, verify: function}';

const validStrategy = (strategy) => {
  assert(has('authenticate', strategy), INVALID_STRATEGY_MSG);
  assert(typeof strategy.authenticate === 'function', INVALID_STRATEGY_MSG);

  if (has('verify', strategy)) {
    assert(typeof strategy.verify === 'function', INVALID_STRATEGY_MSG);
  }
};

const createAuthentication = () => {
  const strategies = {};

  return {
    register(type, strategy) {
      validStrategy(strategy);

      if (!strategies[type]) {
        strategies[type] = [];
      }

      strategies[type].push(strategy);

      return this;
    },

    async authenticate(ctx, next) {
      const { route } = ctx.state;

      // use route strategy
      const config = prop('config.auth', route);

      if (config === false) {
        return next();
      }

      const routeStrategies = strategies[route.info.type];
      const configStrategies = config?.strategies ?? routeStrategies ?? [];

      const strategiesToUse = configStrategies.reduce((acc, strategy) => {
        // Resolve by strategy name
        if (typeof strategy === 'string') {
          const routeStrategy = routeStrategies.find((rs) => rs.name === strategy);

          if (routeStrategy) {
            acc.push(routeStrategy);
          }
        }

        // Use the given strategy as is
        else if (typeof strategy === 'object') {
          validStrategy(strategy);

          acc.push(strategy);
        }

        return acc;
      }, []);

      for (const strategy of strategiesToUse) {
        const result = await strategy.authenticate(ctx);

        const { authenticated = false, credentials, ability = null, error = null } = result || {};

        if (error !== null) {
          return ctx.unauthorized(error);
        }

        if (authenticated) {
          ctx.state.isAuthenticated = true;
          ctx.state.auth = {
            strategy,
            credentials,
            ability,
          };

          return next();
        }
      }

      return ctx.unauthorized('Missing or invalid credentials');
    },

    async verify(auth, config = {}) {
      if (config === false) {
        return;
      }

      if (!auth) {
        throw new UnauthorizedError();
      }

      if (typeof auth.strategy.verify === 'function') {
        return auth.strategy.verify(auth, config);
      }
    },
  };
};

module.exports = createAuthentication;
