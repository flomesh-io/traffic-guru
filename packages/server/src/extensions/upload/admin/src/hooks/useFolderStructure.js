import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useFetchClient } from '@strapi/helper-plugin';
import pluginId from '../pluginId';
import { getRequestUrl, getTrad } from '../utils';
import { recursiveRenameKeys } from './utils/rename-keys';

const FIELD_MAPPING = {
  name: 'label',
  id: 'value',
};

export const useFolderStructure = ({ enabled = true } = {}) => {
  const { formatMessage } = useIntl();
  const dataRequestURL = getRequestUrl('folder-structure');
  const { get } = useFetchClient();

  const fetchFolderStructure = async () => {
    const {
      data: { data },
    } = await get(dataRequestURL);

    const children = data.map((f) => recursiveRenameKeys(f, (key) => FIELD_MAPPING?.[key] ?? key));

    return [
      {
        value: null,
        label: formatMessage({
          id: getTrad('form.input.label.folder-location-default-label'),
          defaultMessage: 'Media Library',
        }),
        children,
      },
    ];
  };

  const { data, error, isLoading } = useQuery(
    [pluginId, 'folder', 'structure'],
    fetchFolderStructure,
    {
      enabled,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  return { data, error, isLoading };
};
