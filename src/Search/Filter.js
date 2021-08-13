import { capitalizeAndSpace } from '../App/helpers';
import { Box, Flex, Heading } from '../Primitives';
import KeywordsPicker from './KeywordsPicker';
import OptionsPicker from './OptionsPicker';
import Range from './Range';
import TextInput from './TextInput';

const Filter = ({ obj }) => {
  return (
    <Box>
      <Heading
        variant="small"
        onClick={(e) => obj.toggleIsActive(e)}
        sx={{
          cursor: 'pointer',
          color: obj.isActive ? 'heading' : 'text',
          fontSize: 1,
          fontWeight: obj.isActive ? 600 : 400,
          textTransform: 'capitalize',
        }}
      >
        {capitalizeAndSpace(obj.name ?? obj.value)}
      </Heading>

      <Flex column mx={2}>
        {obj?.operator === 'between' ? (
          <Range obj={obj} />
        ) : obj.options ? (
          <OptionsPicker obj={obj} />
        ) : obj.list ? (
          <KeywordsPicker obj={obj} />
        ) : (
          ['ilike', 'nilike', 'like', 'nlike', 'regexp', 'eq', 'neq'].includes(
            obj?.operator
          ) && <TextInput obj={obj} />
        )}
      </Flex>
    </Box>
  );
};

export default Filter;