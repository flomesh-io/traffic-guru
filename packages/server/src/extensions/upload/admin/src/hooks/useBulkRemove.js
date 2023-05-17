import { useMutation, useQueryClient } from 'react-query';
import { useNotification, useFetchClient } from '@strapi/helper-plugin';

import pluginId from '../pluginId';
import { getRequestUrl, getTrad } from '../utils';

export const useBulkRemove = () => {
  const toggleNotification = useNotification();
  const queryClient = useQueryClient();
  const url = getRequestUrl('actions/bulk-delete');
  const { post } = useFetchClient();

  const bulkRemoveQuery = (filesAndFolders) => {
    const payload = filesAndFolders.reduce((acc, selected) => {
      const { id, type } = selected;
      const key = type === 'asset' ? 'fileIds' : 'folderIds';

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(id);

      return acc;
    }, {});

    return post(url, payload);
  };

  const mutation = useMutation(bulkRemoveQuery, {
    onSuccess(res) {
      const {
        data: { data },
      } = res;

      if (data?.files?.length > 0) {
        queryClient.refetchQueries([pluginId, 'assets'], { active: true });
        queryClient.refetchQueries([pluginId, 'asset-count'], { active: true });
      }

      if (data?.folders?.length > 0) {
        queryClient.refetchQueries([pluginId, 'folders'], { active: true });
      }

      toggleNotification({
        type: 'success',
        message: {
          id: getTrad('modal.remove.success-label'),
          defaultMessage: 'Elements have been successfully deleted.',
        },
      });
    },
    onError(error) {
      toggleNotification({ type: 'warning', message: error.message });
    },
  });

  const remove = (...args) => mutation.mutateAsync(...args);

  return { ...mutation, remove };
};
