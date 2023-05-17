/**
 * @param {string} pathname
 * @param {object} query
 * @param {string} query._q Search value of the query
 * @param {number|undefined} folderID
 * @returns {string}
 */

import { stringify } from 'qs';

const getFolderURL = (pathname, query, folderID) => {
  const { _q, ...queryParamsWithoutQ } = query;
  const queryParamsString = stringify(
    {
      ...queryParamsWithoutQ,
      folder: folderID,
    },
    { encode: false }
  );

  // Search query will always fetch the same results
  // we remove it here to allow navigating in a folder and see the result of this navigation
  return `${pathname}${queryParamsString ? `?${queryParamsString}` : ''}`;
};

export default getFolderURL;
