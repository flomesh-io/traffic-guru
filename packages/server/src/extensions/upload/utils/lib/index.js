'use strict';

/**
 * Export shared utilities
 */
const { buildQuery, hasDeepFilters } = require('./build-query');
const parseMultipartData = require('./parse-multipart');
const parseType = require('./parse-type');
const policy = require('./policy');
const templateConfiguration = require('./template-configuration');
const { yup, handleYupError, validateYupSchema, validateYupSchemaSync } = require('./validators');
const errors = require('./errors');
const {
  nameToSlug,
  nameToCollectionName,
  getCommonBeginning,
  escapeQuery,
  stringIncludes,
  stringEquals,
  isKebabCase,
  isCamelCase,
  toRegressedEnumValue,
  startsWithANumber,
  joinBy,
  toKebabCase,
} = require('./string-formatting');
const { removeUndefined, keysDeep } = require('./object-formatting');
const { getConfigUrls, getAbsoluteAdminUrl, getAbsoluteServerUrl } = require('./config');
const { generateTimestampCode } = require('./code-generator');
const contentTypes = require('./content-types');
const webhook = require('./webhook');
const env = require('./env-helper');
const relations = require('./relations');
const setCreatorFields = require('./set-creator-fields');
const hooks = require('./hooks');
const providerFactory = require('./provider-factory');
const pagination = require('./pagination');
const sanitize = require('./sanitize');
const traverseEntity = require('./traverse-entity');
const { pipeAsync, mapAsync, reduceAsync, forEachAsync } = require('./async');
const convertQueryParams = require('./convert-query-params');
const importDefault = require('./import-default');
const template = require('./template');
const file = require('./file');

module.exports = {
  yup,
  handleYupError,
  policy,
  templateConfiguration,
  buildQuery,
  hasDeepFilters,
  parseMultipartData,
  sanitize,
  traverseEntity,
  parseType,
  nameToSlug,
  toRegressedEnumValue,
  startsWithANumber,
  joinBy,
  nameToCollectionName,
  getCommonBeginning,
  getConfigUrls,
  escapeQuery,
  removeUndefined,
  keysDeep,
  getAbsoluteAdminUrl,
  getAbsoluteServerUrl,
  generateTimestampCode,
  stringIncludes,
  stringEquals,
  template,
  isKebabCase,
  isCamelCase,
  toKebabCase,
  contentTypes,
  webhook,
  env,
  relations,
  setCreatorFields,
  hooks,
  providerFactory,
  pagination,
  pipeAsync,
  mapAsync,
  reduceAsync,
  forEachAsync,
  errors,
  validateYupSchema,
  validateYupSchemaSync,
  convertQueryParams,
  importDefault,
  file,
};
