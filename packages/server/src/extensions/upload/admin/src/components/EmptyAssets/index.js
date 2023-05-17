import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography, Stack, Box, Icon } from '@strapi/design-system';
import { EmptyStateDocuments } from '@strapi/icons';
import { EmptyAssetGrid } from './EmptyAssetGrid';

const EnhancedStack = styled(Stack)`
  align-items: center;
`;

export const EmptyAssets = ({ icon, content, action, size, count }) => {
  return (
    <Box position="relative">
      <EmptyAssetGrid size={size} count={count} />

      <Box position="absolute" top={11} width="100%">
        <EnhancedStack spacing={4} textAlign="center">
          <EnhancedStack spacing={6}>
            <Icon as={icon || EmptyStateDocuments} color="" width="160px" height="88px" />

            <Typography variant="delta" as="p" textColor="neutral600">
              {content}
            </Typography>
          </EnhancedStack>

          {action}
        </EnhancedStack>
      </Box>
    </Box>
  );
};

EmptyAssets.defaultProps = {
  action: undefined,
  icon: undefined,
  size: 'M',
  count: 12,
};

EmptyAssets.propTypes = {
  action: PropTypes.node,
  icon: PropTypes.func,
  content: PropTypes.string.isRequired,
  size: PropTypes.string,
  count: PropTypes.number,
};
