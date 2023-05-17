import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ContentLayout,
  HeaderLayout,
  Main,
  Button,
  Stack,
  Box,
  TextInput,
  Textarea,
  Typography,
  GridItem,
  Grid,
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import { Formik } from 'formik';
import { useIntl } from 'react-intl';
import {
  useOverlayBlocker,
  SettingsPageTitle,
  useFetchClient,
  useTracking,
  Form,
  useNotification,
} from '@strapi/helper-plugin';
import UsersPermissions from '../../../components/UsersPermissions';
import getTrad from '../../../utils/getTrad';
import pluginId from '../../../pluginId';
import { usePlugins } from '../../../hooks';
import schema from './utils/schema';

const EditPage = () => {
  const { formatMessage } = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toggleNotification = useNotification();
  const { goBack } = useHistory();
  const { lockApp, unlockApp } = useOverlayBlocker();
  const { isLoading: isLoadingPlugins, permissions, routes } = usePlugins();
  const { trackUsage } = useTracking();
  const permissionsRef = useRef();
  const { post } = useFetchClient();

  const handleCreateRoleSubmit = async (data) => {
    // Set loading state
    lockApp();
    setIsSubmitting(true);
    try {
      const permissions = permissionsRef.current.getPermissions();
      // Update role in Strapi
      await post(`/${pluginId}/roles`, { ...data, ...permissions, users: [] });
      // Notify success
      trackUsage('didCreateRole');
      toggleNotification({
        type: 'success',
        message: {
          id: getTrad('Settings.roles.created'),
          defaultMessage: 'Role created',
        },
      });
      // Forcing redirecting since we don't have the id in the response
      goBack();
    } catch (err) {
      console.error(err);
      toggleNotification({
        type: 'warning',
        message: {
          id: 'notification.error',
          defaultMessage: 'An error occurred',
        },
      });
    }
    // Unset loading state
    setIsSubmitting(false);
    unlockApp();
  };

  return (
    <Main>
      <SettingsPageTitle name="Roles" />
      <Formik
        enableReinitialize
        initialValues={{ name: '', description: '' }}
        onSubmit={handleCreateRoleSubmit}
        validationSchema={schema}
      >
        {({ handleSubmit, values, handleChange, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <HeaderLayout
              primaryAction={
                !isLoadingPlugins && (
                  <Button type="submit" loading={isSubmitting} startIcon={<Check />}>
                    {formatMessage({
                      id: 'global.save',
                      defaultMessage: 'Save',
                    })}
                  </Button>
                )
              }
              title={formatMessage({
                id: 'Settings.roles.create.title',
                defaultMessage: 'Create a role',
              })}
              subtitle={formatMessage({
                id: 'Settings.roles.create.description',
                defaultMessage: 'Define the rights given to the role',
              })}
            />
            <ContentLayout>
              <Stack spacing={7}>
                <Box
                  background="neutral0"
                  hasRadius
                  shadow="filterShadow"
                  paddingTop={6}
                  paddingBottom={6}
                  paddingLeft={7}
                  paddingRight={7}
                >
                  <Stack spacing={4}>
                    <Typography variant="delta" as="h2">
                      {formatMessage({
                        id: getTrad('EditPage.form.roles'),
                        defaultMessage: 'Role details',
                      })}
                    </Typography>
                    <Grid gap={4}>
                      <GridItem col={6}>
                        <TextInput
                          name="name"
                          value={values.name || ''}
                          onChange={handleChange}
                          label={formatMessage({
                            id: 'global.name',
                            defaultMessage: 'Name',
                          })}
                          error={
                            errors.name
                              ? formatMessage({ id: errors.name, defaultMessage: 'Invalid value' })
                              : null
                          }
                        />
                      </GridItem>
                      <GridItem col={6}>
                        <Textarea
                          name="description"
                          value={values.description || ''}
                          onChange={handleChange}
                          label={formatMessage({
                            id: 'global.description',
                            defaultMessage: 'Description',
                          })}
                          error={
                            errors.description
                              ? formatMessage({
                                  id: errors.description,
                                  defaultMessage: 'Invalid value',
                                })
                              : null
                          }
                        />
                      </GridItem>
                    </Grid>
                  </Stack>
                </Box>
                {!isLoadingPlugins && (
                  <UsersPermissions
                    ref={permissionsRef}
                    permissions={permissions}
                    routes={routes}
                  />
                )}
              </Stack>
            </ContentLayout>
          </Form>
        )}
      </Formik>
    </Main>
  );
};

export default EditPage;
