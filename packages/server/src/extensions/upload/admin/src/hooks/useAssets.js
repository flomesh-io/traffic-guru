import { stringify } from 'qs';
import { useQuery } from 'react-query';
import { useNotifyAT } from '@strapi/design-system';
import { useNotification, useFetchClient } from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';

import pluginId from '../pluginId';
import { getRequestUrl } from '../utils';

export const useAssets = ({ skipWhen = false, query = {} } = {}) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { notifyStatus } = useNotifyAT();
  const { get } = useFetchClient();
  const dataRequestURL = getRequestUrl('files');
  const { folder, _q, ...paramsExceptFolderAndQ } = query;

  let params;

  if (_q) {
    params = {
      ...paramsExceptFolderAndQ,
      _q: encodeURIComponent(_q),
    };
  } else {
    params = {
      ...paramsExceptFolderAndQ,
      filters: {
        $and: [
          ...(paramsExceptFolderAndQ?.filters?.$and ?? []),
          {
            folder: {
              id: folder ?? {
                $null: true,
              },
            },
          },
        ],
      },
    };
  }

  const getAssets = async () => {
    try {
      const { data } = await get(
        `${dataRequestURL}${stringify(params, {
          encode: false,
          addQueryPrefix: true,
        })}`
      );

      notifyStatus(
        formatMessage({
          id: 'list.asset.at.finished',
          defaultMessage: 'The assets have finished loading.',
        })
      );

      return data;
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: { id: 'notification.error' },
      });

      throw err;
    }
  };

  const { data, error, isLoading } = useQuery([pluginId, 'assets', stringify(params)], getAssets, {
    enabled: !skipWhen,
    staleTime: 0,
    cacheTime: 0,
  });

  return { data, error, isLoading };
};
