import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  Flex,
  Button,
  Divider,
  Typography,
  Tabs,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
  Badge,
  Loader,
  Stack,
} from '@strapi/design-system';
import { NoPermissions, AnErrorOccurred, useSelectionState, pxToRem } from '@strapi/helper-plugin';
import { getTrad, containsAssetFilter } from '../../utils';
import { SelectedStep } from './SelectedStep';
import { BrowseStep } from './BrowseStep';
import { useMediaLibraryPermissions } from '../../hooks/useMediaLibraryPermissions';
import { useAssets } from '../../hooks/useAssets';
import { useFolders } from '../../hooks/useFolders';
import useModalQueryParams from '../../hooks/useModalQueryParams';
import { AssetDefinition } from '../../constants';
import getAllowedFiles from '../../utils/getAllowedFiles';
import { DialogFooter } from './DialogFooter';
import { EditAssetDialog } from '../EditAssetDialog';
import { moveElement } from '../../utils/moveElement';
import { EditFolderDialog } from '../EditFolderDialog';

const LoadingBody = styled(Flex)`
  /* 80px are coming from the Tabs component that is not included in the ModalBody */
  min-height: ${() => `calc(60vh + ${pxToRem(80)})`};
`;

export const AssetDialog = ({
  allowedTypes,
  folderId,
  onClose,
  onAddAsset,
  onAddFolder,
  onChangeFolder,
  onValidate,
  multiple,
  initiallySelectedAssets,
  trackedLocation,
}) => {
  const [assetToEdit, setAssetToEdit] = useState(undefined);
  const [folderToEdit, setFolderToEdit] = useState(undefined);
  const { formatMessage } = useIntl();
  const {
    canRead,
    canCreate,
    isLoading: isLoadingPermissions,
    canUpdate,
    canCopyLink,
    canDownload,
  } = useMediaLibraryPermissions();

  const [
    { queryObject },
    {
      onChangeFilters,
      onChangePage,
      onChangePageSize,
      onChangeSort,
      onChangeSearch,
      onChangeFolder: onChangeFolderParam,
    },
  ] = useModalQueryParams({ folder: folderId });

  const {
    data: { pagination, results: assets } = {},
    isLoading: isLoadingAssets,
    error: errorAssets,
  } = useAssets({ skipWhen: !canRead, query: queryObject });

  const {
    data: folders,
    isLoading: isLoadingFolders,
    error: errorFolders,
  } = useFolders({
    enabled: canRead && !containsAssetFilter(queryObject) && pagination?.page === 1,
    query: queryObject,
  });

  const [selectedAssets, { selectOne, selectAll, selectOnly, setSelections }] = useSelectionState(
    ['id'],
    initiallySelectedAssets
  );

  const [initialSelectedTabIndex, setInitialSelectedTabIndex] = useState(
    selectedAssets.length > 0 ? 1 : 0
  );

  const handleSelectAllAssets = () => {
    const hasAllAssets = assets.every(
      (asset) => selectedAssets.findIndex((curr) => curr.id === asset.id) !== -1
    );

    if (hasAllAssets) {
      return multiple ? selectAll(assets) : undefined;
    }

    const allowedAssets = getAllowedFiles(allowedTypes, assets);

    return multiple ? selectAll(allowedAssets) : undefined;
  };

  const handleSelectAsset = (asset) => {
    return multiple ? selectOne(asset) : selectOnly(asset);
  };

  const isLoading = isLoadingPermissions || isLoadingAssets || isLoadingFolders;
  const hasError = errorAssets || errorFolders;

  if (isLoading) {
    return (
      <ModalLayout onClose={onClose} labelledBy="asset-dialog-title" aria-busy>
        <ModalHeader>
          <Typography fontWeight="bold">
            {formatMessage({
              id: getTrad('header.actions.add-assets'),
              defaultMessage: 'Add new assets',
            })}
          </Typography>
        </ModalHeader>
        <LoadingBody justifyContent="center" paddingTop={4} paddingBottom={4}>
          <Loader>
            {formatMessage({
              id: getTrad('content.isLoading'),
              defaultMessage: 'Content is loading.',
            })}
          </Loader>
        </LoadingBody>
        <DialogFooter onClose={onClose} />
      </ModalLayout>
    );
  }

  if (hasError) {
    return (
      <ModalLayout onClose={onClose} labelledBy="asset-dialog-title">
        <ModalHeader>
          <Typography fontWeight="bold">
            {formatMessage({
              id: getTrad('header.actions.add-assets'),
              defaultMessage: 'Add new assets',
            })}
          </Typography>
        </ModalHeader>
        <AnErrorOccurred />
        <DialogFooter onClose={onClose} />
      </ModalLayout>
    );
  }

  if (!canRead) {
    return (
      <ModalLayout onClose={onClose} labelledBy="asset-dialog-title">
        <ModalHeader fontWeight="bold">
          <Typography>
            {formatMessage({
              id: getTrad('header.actions.add-assets'),
              defaultMessage: 'Add new assets',
            })}
          </Typography>
        </ModalHeader>
        <NoPermissions />
        <DialogFooter onClose={onClose} />
      </ModalLayout>
    );
  }

  if (assetToEdit) {
    return (
      <EditAssetDialog
        onClose={() => setAssetToEdit(undefined)}
        asset={assetToEdit}
        canUpdate={canUpdate}
        canCopyLink={canCopyLink}
        canDownload={canDownload}
        trackedLocation={trackedLocation}
      />
    );
  }

  if (folderToEdit) {
    return (
      <EditFolderDialog
        folder={folderToEdit}
        onClose={() => setFolderToEdit(undefined)}
        location="content-manager"
        parentFolderId={queryObject?.folder}
      />
    );
  }

  const handleMoveItem = (hoverIndex, destIndex) => {
    const offset = destIndex - hoverIndex;
    const orderedAssetsClone = selectedAssets.slice();
    const nextAssets = moveElement(orderedAssetsClone, hoverIndex, offset);
    setSelections(nextAssets);
  };

  const handleFolderChange = (folder) => {
    onChangeFolder(folder);
    onChangeFolderParam(folder);
  };

  return (
    <ModalLayout onClose={onClose} labelledBy="asset-dialog-title" aria-busy={isLoading}>
      <ModalHeader>
        <Typography fontWeight="bold">
          {formatMessage({
            id: getTrad('header.actions.add-assets'),
            defaultMessage: 'Add new assets',
          })}
        </Typography>
      </ModalHeader>

      <TabGroup
        label={formatMessage({
          id: getTrad('tabs.title'),
          defaultMessage: 'How do you want to upload your assets?',
        })}
        variant="simple"
        initialSelectedTabIndex={initialSelectedTabIndex}
        onTabChange={() => setInitialSelectedTabIndex(0)}
      >
        <Flex paddingLeft={8} paddingRight={8} paddingTop={6} justifyContent="space-between">
          <Tabs>
            <Tab>
              {formatMessage({
                id: getTrad('modal.nav.browse'),
                defaultMessage: 'Browse',
              })}
            </Tab>
            <Tab>
              {formatMessage({
                id: getTrad('modal.header.select-files'),
                defaultMessage: 'Selected files',
              })}
              <Badge marginLeft={2}>{selectedAssets.length}</Badge>
            </Tab>
          </Tabs>
          <Stack horizontal spacing={2}>
            <Button
              variant="secondary"
              onClick={() => onAddFolder({ folderId: queryObject?.folder })}
            >
              {formatMessage({
                id: getTrad('modal.upload-list.sub-header.add-folder'),
                defaultMessage: 'Add folder',
              })}
            </Button>
            <Button onClick={() => onAddAsset({ folderId: queryObject?.folder })}>
              {formatMessage({
                id: getTrad('modal.upload-list.sub-header.button'),
                defaultMessage: 'Add more assets',
              })}
            </Button>
          </Stack>
        </Flex>
        <Divider />
        <TabPanels>
          <TabPanel>
            <ModalBody>
              <BrowseStep
                allowedTypes={allowedTypes}
                assets={assets}
                canCreate={canCreate}
                canRead={canRead}
                folders={folders}
                onSelectAsset={handleSelectAsset}
                selectedAssets={selectedAssets}
                multiple={multiple}
                onSelectAllAsset={handleSelectAllAssets}
                onEditAsset={setAssetToEdit}
                onEditFolder={setFolderToEdit}
                pagination={pagination}
                queryObject={queryObject}
                onAddAsset={onAddAsset}
                onChangeFilters={onChangeFilters}
                onChangeFolder={handleFolderChange}
                onChangePage={onChangePage}
                onChangePageSize={onChangePageSize}
                onChangeSort={onChangeSort}
                onChangeSearch={onChangeSearch}
              />
            </ModalBody>
          </TabPanel>
          <TabPanel>
            <ModalBody>
              <SelectedStep
                selectedAssets={selectedAssets}
                onSelectAsset={handleSelectAsset}
                onReorderAsset={handleMoveItem}
              />
            </ModalBody>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <DialogFooter onClose={onClose} onValidate={() => onValidate(selectedAssets)} />
    </ModalLayout>
  );
};

AssetDialog.defaultProps = {
  allowedTypes: [],
  folderId: null,
  initiallySelectedAssets: [],
  multiple: false,
  trackedLocation: undefined,
};

AssetDialog.propTypes = {
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  folderId: PropTypes.number,
  initiallySelectedAssets: PropTypes.arrayOf(AssetDefinition),
  multiple: PropTypes.bool,
  onAddAsset: PropTypes.func.isRequired,
  onAddFolder: PropTypes.func.isRequired,
  onChangeFolder: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  trackedLocation: PropTypes.string,
};
