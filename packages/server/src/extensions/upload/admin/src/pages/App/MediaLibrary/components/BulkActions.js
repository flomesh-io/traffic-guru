import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Stack, Typography } from '@strapi/design-system';

import { AssetDefinition, FolderDefinition } from '../../../../constants';
import getTrad from '../../../../utils/getTrad';
import { BulkDeleteButton } from './BulkDeleteButton';
import { BulkMoveButton } from './BulkMoveButton';

export const BulkActions = ({ selected, onSuccess, currentFolder }) => {
  const { formatMessage } = useIntl();

  return (
    <Stack horizontal spacing={2} paddingBottom={5}>
      <Typography variant="epsilon" textColor="neutral600">
        {formatMessage(
          {
            id: getTrad('list.assets.selected'),
            defaultMessage:
              '{numberFolders, plural, one {1 folder} other {# folders}} - {numberAssets, plural, one {1 asset} other {# assets}} selected',
          },
          {
            numberFolders: selected.filter(({ type }) => type === 'folder').length,
            numberAssets: selected.filter(({ type }) => type === 'asset').length,
          }
        )}
      </Typography>

      <BulkDeleteButton selected={selected} onSuccess={onSuccess} />
      <BulkMoveButton currentFolder={currentFolder} selected={selected} onSuccess={onSuccess} />
    </Stack>
  );
};

BulkActions.defaultProps = {
  currentFolder: undefined,
};

BulkActions.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  currentFolder: FolderDefinition,
  selected: PropTypes.arrayOf(AssetDefinition, FolderDefinition).isRequired,
};
