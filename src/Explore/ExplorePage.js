import React from 'react';

import { Flex, Box } from '../Primitives';
import Search from '../Search/Search';
import DocumentList from './DocumentList';

const ExplorePage = () => {
  return (
    <Flex flexDirection={['column', 'column', 'row']} gap={[3, 3, 3, 4]}>
      <Box display={['block', 'block', 'none']} width={[1, 1, 1 / 4]}>
        <Box as="details">
          <Box as="summary" sx={{ fontSize: 3, cursor: 'pointer' }}>
            Filters
          </Box>
          <Box mt={2}>
            <Search />
          </Box>
        </Box>
      </Box>
      <Box display={['none', 'none', 'block']} width={[1, 1, 1 / 4]}>
        <Search />
      </Box>
      <Box width={[1, 1, 3 / 4]}>
        <DocumentList name="Data" />
      </Box>
    </Flex>
  );
};
export default ExplorePage;