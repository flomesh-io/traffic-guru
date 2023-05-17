import React, { useMemo, useState } from 'react';
import {
  Button,
  HeaderLayout,
  Layout,
  ContentLayout,
  ActionLayout,
  Main,
  Table,
  Tr,
  Thead,
  Th,
  Typography,
  useNotifyAT,
  VisuallyHidden,
} from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import {
  useTracking,
  SettingsPageTitle,
  CheckPermissions,
  useNotification,
  useRBAC,
  NoPermissions,
  LoadingIndicatorPage,
  SearchURLQuery,
  useFocusWhenNavigate,
  useQueryParams,
  EmptyStateLayout,
  ConfirmDialog,
} from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import matchSorter from 'match-sorter';

import { fetchData, deleteData } from './utils/api';
import { getTrad } from '../../../utils';
import pluginId from '../../../pluginId';
import permissions from '../../../permissions';
import TableBody from './components/TableBody';

const RoleListPage = () => {
  const { trackUsage } = useTracking();
  const { formatMessage } = useIntl();
  const { push } = useHistory();
  const toggleNotification = useNotification();
  const { notifyStatus } = useNotifyAT();
  const [{ query }] = useQueryParams();
  const _q = query?._q || '';
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isConfirmButtonLoading, setIsConfirmButtonLoading] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState();
  useFocusWhenNavigate();

  const queryClient = useQueryClient();

  const updatePermissions = useMemo(() => {
    return {
      create: permissions.createRole,
      read: permissions.readRoles,
      update: permissions.updateRole,
      delete: permissions.deleteRole,
    };
  }, []);

  const {
    isLoading: isLoadingForPermissions,
    allowedActions: { canRead, canDelete },
  } = useRBAC(updatePermissions);

  const {
    isLoading: isLoadingForData,
    data: { roles },
    isFetching,
  } = useQuery('get-roles', () => fetchData(toggleNotification, notifyStatus), {
    initialData: {},
    enabled: canRead,
  });

  const isLoading = isLoadingForData || isFetching;

  const handleNewRoleClick = () => {
    trackUsage('willCreateRole');
    push(`/settings/${pluginId}/roles/new`);
  };

  const handleShowConfirmDelete = () => {
    setShowConfirmDelete(!showConfirmDelete);
  };

  const emptyLayout = {
    roles: {
      id: getTrad('Roles.empty'),
      defaultMessage: "You don't have any roles yet.",
    },
    search: {
      id: getTrad('Roles.empty.search'),
      defaultMessage: 'No roles match the search.',
    },
  };

  const pageTitle = formatMessage({
    id: 'global.roles',
    defaultMessage: 'Roles',
  });

  const deleteMutation = useMutation((id) => deleteData(id, toggleNotification), {
    async onSuccess() {
      await queryClient.invalidateQueries('get-roles');
    },
  });

  const handleConfirmDelete = async () => {
    setIsConfirmButtonLoading(true);
    await deleteMutation.mutateAsync(roleToDelete);
    setShowConfirmDelete(!showConfirmDelete);
    setIsConfirmButtonLoading(false);
  };

  const sortedRoles = matchSorter(roles || [], _q, { keys: ['name', 'description'] });
  const emptyContent = _q && !sortedRoles.length ? 'search' : 'roles';

  const colCount = 4;
  const rowCount = (roles?.length || 0) + 1;

  return (
    <Layout>
      <SettingsPageTitle name={pageTitle} />
      <Main aria-busy={isLoading}>
        <HeaderLayout
          title={formatMessage({
            id: 'global.roles',
            defaultMessage: 'Roles',
          })}
          subtitle={formatMessage({
            id: 'Settings.roles.list.description',
            defaultMessage: 'List of roles',
          })}
          primaryAction={
            <CheckPermissions permissions={permissions.createRole}>
              <Button onClick={handleNewRoleClick} startIcon={<Plus />} size="S">
                {formatMessage({
                  id: getTrad('List.button.roles'),
                  defaultMessage: 'Add new role',
                })}
              </Button>
            </CheckPermissions>
          }
        />

        <ActionLayout
          startActions={
            <SearchURLQuery
              label={formatMessage({
                id: 'app.component.search.label',
                defaultMessage: 'Search',
              })}
            />
          }
        />

        <ContentLayout>
          {!canRead && <NoPermissions />}
          {(isLoading || isLoadingForPermissions) && <LoadingIndicatorPage />}
          {canRead && sortedRoles && sortedRoles?.length ? (
            <Table colCount={colCount} rowCount={rowCount}>
              <Thead>
                <Tr>
                  <Th>
                    <Typography variant="sigma" textColor="neutral600">
                      {formatMessage({ id: 'global.name', defaultMessage: 'Name' })}
                    </Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma" textColor="neutral600">
                      {formatMessage({
                        id: 'global.description',
                        defaultMessage: 'Description',
                      })}
                    </Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma" textColor="neutral600">
                      {formatMessage({
                        id: 'global.users',
                        defaultMessage: 'Users',
                      })}
                    </Typography>
                  </Th>
                  <Th>
                    <VisuallyHidden>
                      {formatMessage({
                        id: 'global.actions',
                        defaultMessage: 'Actions',
                      })}
                    </VisuallyHidden>
                  </Th>
                </Tr>
              </Thead>
              <TableBody
                sortedRoles={sortedRoles}
                canDelete={canDelete}
                permissions={permissions}
                setRoleToDelete={setRoleToDelete}
                onDelete={[showConfirmDelete, setShowConfirmDelete]}
              />
            </Table>
          ) : (
            <EmptyStateLayout content={emptyLayout[emptyContent]} />
          )}
        </ContentLayout>
        <ConfirmDialog
          isConfirmButtonLoading={isConfirmButtonLoading}
          onConfirm={handleConfirmDelete}
          onToggleDialog={handleShowConfirmDelete}
          isOpen={showConfirmDelete}
        />
      </Main>
    </Layout>
  );
};

export default RoleListPage;
