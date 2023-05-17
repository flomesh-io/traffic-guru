import * as yup from 'yup';
import { Formik } from 'formik';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { useIntl } from 'react-intl';
import {
  Button,
  Grid,
  GridItem,
  ModalLayout,
  ModalBody,
  ModalFooter,
  FieldLabel,
  Flex,
  Loader,
  Stack,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { Form, useNotification, getAPIInnerErrors, useTracking } from '@strapi/helper-plugin';

import { getTrad, findRecursiveFolderByValue } from '../../utils';
import { FolderDefinition } from '../../constants';
import { useEditFolder } from '../../hooks/useEditFolder';
import { useBulkRemove } from '../../hooks/useBulkRemove';
import { useFolderStructure } from '../../hooks/useFolderStructure';
import { useMediaLibraryPermissions } from '../../hooks/useMediaLibraryPermissions';
import { ContextInfo } from '../ContextInfo';
import SelectTree from '../SelectTree';
import { EditFolderModalHeader } from './ModalHeader';
import RemoveFolderDialog from './RemoveFolderDialog';

const folderSchema = yup.object({
  name: yup.string().required(),
  parent: yup
    .object({
      label: yup.string(),
      value: yup.number().nullable(true),
    })
    .nullable(true),
});

export const EditFolderDialog = ({ onClose, folder, location, parentFolderId }) => {
  const { data: folderStructure, isLoading: folderStructureIsLoading } = useFolderStructure({
    enabled: true,
  });
  const { canCreate, isLoading: isLoadingPermissions, canUpdate } = useMediaLibraryPermissions();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { formatMessage, formatDate } = useIntl();
  const { trackUsage } = useTracking();
  const { editFolder, isLoading: isEditFolderLoading } = useEditFolder();
  const { remove } = useBulkRemove();
  const toggleNotification = useNotification();
  const isLoading = isLoadingPermissions || folderStructureIsLoading;
  const isEditing = !!folder;
  const formDisabled = (folder && !canUpdate) || (!folder && !canCreate);
  const initialFormData = !folderStructureIsLoading && {
    name: folder?.name ?? '',
    parent: {
      /* ideally we would use folderStructure[0].value, but since it is null
         react complains about rendering null as field value */
      value: parentFolderId ? parseInt(parentFolderId, 10) : undefined,
      label: parentFolderId
        ? findRecursiveFolderByValue(folderStructure, parseInt(parentFolderId, 10))?.label
        : folderStructure[0].label,
    },
  };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      await editFolder(
        {
          ...values,
          parent: values.parent.value ?? null,
        },
        folder?.id
      );

      toggleNotification({
        type: 'success',
        message: isEditing
          ? formatMessage({
              id: getTrad('modal.folder-notification-edited-success'),
              defaultMessage: 'Folder successfully edited',
            })
          : formatMessage({
              id: getTrad('modal.folder-notification-created-success'),
              defaultMessage: 'Folder successfully created',
            }),
      });

      if (isEditing) {
        const didChangeLocation = parentFolderId
          ? parseInt(parentFolderId, 10) !== values.parent.value
          : parentFolderId === null && !!values.parent.value;

        trackUsage('didEditMediaLibraryElements', {
          location,
          type: 'folder',
          changeLocation: didChangeLocation,
        });
      } else {
        trackUsage('didAddMediaLibraryFolders', { location });
      }

      onClose({ created: true });
    } catch (err) {
      const errors = getAPIInnerErrors(err, { getTrad });
      const formikErrors = Object.entries(errors).reduce((acc, [key, error]) => {
        acc[key] = error.defaultMessage;

        return acc;
      }, {});

      if (!isEmpty(formikErrors)) {
        setErrors(formikErrors);
      }
    }
  };

  const handleDelete = async () => {
    await remove([folder]);

    setShowConfirmDialog(false);
    onClose();
  };

  if (isLoading) {
    return (
      <ModalLayout onClose={() => onClose()} labelledBy="title">
        <EditFolderModalHeader isEditing={isEditing} />

        <ModalBody>
          <Flex justifyContent="center" paddingTop={4} paddingBottom={4}>
            <Loader>
              {formatMessage({
                id: getTrad('content.isLoading'),
                defaultMessage: 'Content is loading.',
              })}
            </Loader>
          </Flex>
        </ModalBody>
      </ModalLayout>
    );
  }

  return (
    <>
      <ModalLayout onClose={() => onClose()} labelledBy="title">
        <Formik
          validationSchema={folderSchema}
          validateOnChange={false}
          onSubmit={handleSubmit}
          initialValues={initialFormData}
        >
          {({ values, errors, handleChange, setFieldValue }) => (
            <Form noValidate>
              <EditFolderModalHeader isEditing={isEditing} />

              <ModalBody>
                <Grid gap={4}>
                  {isEditing && (
                    <GridItem xs={12} col={12}>
                      <ContextInfo
                        blocks={[
                          {
                            label: formatMessage({
                              id: getTrad('modal.folder.create.elements'),
                              defaultMessage: 'Elements',
                            }),
                            value: formatMessage(
                              {
                                id: getTrad('modal.folder.elements.count'),
                                defaultMessage: '{folderCount} folders, {assetCount} assets',
                              },
                              {
                                assetCount: folder?.files?.count ?? 0,
                                folderCount: folder?.children?.count ?? 0,
                              }
                            ),
                          },

                          {
                            label: formatMessage({
                              id: getTrad('modal.folder.create.creation-date'),
                              defaultMessage: 'Creation Date',
                            }),
                            value: formatDate(new Date(folder.createdAt)),
                          },
                        ]}
                      />
                    </GridItem>
                  )}

                  <GridItem xs={12} col={6}>
                    <TextInput
                      label={formatMessage({
                        id: getTrad('form.input.label.folder-name'),
                        defaultMessage: 'Name',
                      })}
                      name="name"
                      value={values.name}
                      error={errors.name}
                      onChange={handleChange}
                      disabled={formDisabled}
                    />
                  </GridItem>

                  <GridItem xs={12} col={6}>
                    <Stack spacing={1}>
                      <FieldLabel htmlFor="folder-parent">
                        {formatMessage({
                          id: getTrad('form.input.label.folder-location'),
                          defaultMessage: 'Location',
                        })}
                      </FieldLabel>

                      <SelectTree
                        options={folderStructure}
                        onChange={(value) => {
                          setFieldValue('parent', value);
                        }}
                        isDisabled={formDisabled}
                        defaultValue={values.parent}
                        name="parent"
                        menuPortalTarget={document.querySelector('body')}
                        inputId="folder-parent"
                        disabled={formDisabled}
                        error={errors?.parent}
                        ariaErrorMessage="folder-parent-error"
                      />

                      {errors.parent && (
                        <Typography
                          variant="pi"
                          as="p"
                          id="folder-parent-error"
                          textColor="danger600"
                        >
                          {errors.parent}
                        </Typography>
                      )}
                    </Stack>
                  </GridItem>
                </Grid>
              </ModalBody>

              <ModalFooter
                startActions={
                  <Button onClick={() => onClose()} variant="tertiary" name="cancel">
                    {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
                  </Button>
                }
                endActions={
                  <Stack horizontal spacing={2}>
                    {isEditing && canUpdate && (
                      <Button
                        type="button"
                        variant="danger-light"
                        onClick={() => setShowConfirmDialog(true)}
                        name="delete"
                        disabled={!canUpdate || isEditFolderLoading}
                      >
                        {formatMessage({
                          id: getTrad('modal.folder.create.delete'),
                          defaultMessage: 'Delete folder',
                        })}
                      </Button>
                    )}

                    <Button
                      name="submit"
                      loading={isEditFolderLoading}
                      disabled={formDisabled}
                      type="submit"
                    >
                      {formatMessage(
                        isEditing
                          ? { id: getTrad('modal.folder.edit.submit'), defaultMessage: 'Save' }
                          : { id: getTrad('modal.folder.create.submit'), defaultMessage: 'Create' }
                      )}
                    </Button>
                  </Stack>
                }
              />
            </Form>
          )}
        </Formik>
      </ModalLayout>
      {showConfirmDialog && (
        <RemoveFolderDialog onClose={() => setShowConfirmDialog(false)} onConfirm={handleDelete} />
      )}
    </>
  );
};

EditFolderDialog.defaultProps = {
  folder: undefined,
  location: undefined,
  parentFolderId: null,
};

EditFolderDialog.propTypes = {
  folder: FolderDefinition,
  location: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  parentFolderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
