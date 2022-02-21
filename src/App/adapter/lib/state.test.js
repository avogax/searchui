import {
  mergeState,
  parseState,
  resolveOperatorFrom,
  resolvePathFrom,
  createGroupForUsing,
  enhancePagination,
  LABEL_FOR_CONFIG,
  FALLBACK_GROUP_OPERATOR,
} from './state'

const map = {
  techniques: {
    datasets: [],
    fallback: ['datasets'],
  },
}
const resolvePath = resolvePathFrom(map)

const operators = {
  techniques: 'or',
}
const resolveOperator = resolveOperatorFrom(operators)

describe('resolvePathFrom(map)(label, endpoint)', () => {
  it('gets path for endpoint', () => {
    expect(resolvePath('techniques', 'datasets')).toEqual(['techniques'])
  })
  it('gets fallback path', () => {
    expect(resolvePath('techniques', 'documents')).toEqual([
      'datasets',
      'techniques',
    ])
  })
  it('is null while label and endpoint match', () => {
    expect(resolvePath('datasets', 'datasets')).toBeNull()
  })
  it('is null if target is not found in map', () => {
    expect(resolvePath('parameters', 'documents')).toBeNull()
  })
})

describe('resolveOperatorFrom(operators)(label)', () => {
  it('returns operator for given label', () => {
    expect(resolveOperator('techniques')).toBe('or')
  })
  it('returns fallback operator if none is found for given label', () => {
    expect(resolveOperator('parameters')).toBe(FALLBACK_GROUP_OPERATOR)
  })
})

describe('createGroupFor(endpoint)(object)', () => {
  const endpoint = 'documents'
  const createGroup = createGroupForUsing(
    resolveOperator,
    resolvePath,
  )(endpoint)

  it('adds operator and target', () => {
    const group = { label: 'techniques' }
    const expected = {
      label: 'techniques',
      operator: 'or',
      target: ['datasets', 'techniques'],
    }
    expect(createGroup(group)).toEqual(expected)
  })

  it('doesnt write over existing keys', () => {
    const group = {
      label: 'techniques',
      operator: 'foo',
      target: ['bar', 'baz'],
    }
    expect(createGroup(group)).toEqual(group)
  })

  it('key value overrides operator', () => {
    const group = {
      label: 'techniques',
      operator: 'or',
      value: 'and',
    }
    const expected = {
      label: 'techniques',
      operator: 'and',
      target: ['datasets', 'techniques'],
    }
    expect(createGroup(group)).toEqual(expected)
  })
})

describe('enhancePagination(config)', () => {
  const config = {
    label: "config's label",
    foo: 'bar',
  }
  it('strips out keys page & pageSize', () => {
    const withPageOnly = { ...config, page: 3 }
    const withPageSizeOnly = { ...config, pageSize: 66 }
    expect(enhancePagination(withPageOnly)).toEqual(config)
    expect(enhancePagination(withPageSizeOnly)).toEqual(config)
  })
  it('produces keys skip & limit based on pageSize and page if both are present', () => {
    const withBoth = { ...config, page: 3, pageSize: 66 }
    const expected = { ...config, skip: 132, limit: 66 }
    expect(enhancePagination(withBoth)).toEqual(expected)
  })
})

describe('mergeState(inits, diffs)', () => {
  it('Works on empty arrays', () => {
    const inits = []
    const diffs = []
    expect(mergeState(inits, diffs)).toHaveLength(0)
  })

  it('Merges objects with matching labels', () => {
    const inits = [
      {
        label: '1',
        group: 'test',
      },
      {
        label: '2',
        group: 'test',
      },
    ]
    const diffs = [
      {
        label: '1',
        value: 'something',
      },
      {
        label: '2',
        value: 'something',
      },
    ]
    const expected = [
      {
        label: '1',
        group: 'test',
        value: 'something',
      },
      {
        label: '2',
        group: 'test',
        value: 'something',
      },
    ]
    expect(mergeState(inits, diffs)).toEqual(expected)
  })

  it('Merges "right"', () => {
    const inits = [
      {
        label: '1',
        group: 'test',
        value: '',
      },
    ]
    const diffs = [
      {
        label: '1',
        value: 'something',
      },
    ]
    const expected = [
      {
        label: '1',
        value: 'something',
        group: 'test',
      },
    ]
    expect(mergeState(inits, diffs)).toEqual(expected)
  })

  it('doesnt keep inactive filters', () => {
    const inits = [
      {
        label: '1',
        group: 'test',
        operator: 'like',
        value: '',
      },
      {
        label: '2',
        group: 'test',
        operator: 'like',
      },
    ]
    const diffs = [
      {
        label: '1',
        value: 'something',
      },
    ]
    const expected = [
      {
        label: '1',
        group: 'test',
        operator: 'like',
        value: 'something',
      },
    ]
    expect(mergeState(inits, diffs)).toEqual(expected)
  })

  it('config is never filtered out', () => {
    const inits = [{ label: LABEL_FOR_CONFIG }]
    const diffs = []
    expect(mergeState(inits, diffs)).toEqual(inits)
  })

  it('groups targeted by active filters are not filtered out', () => {
    const inits = [{ label: 'group' }]
    const diffs = [
      {
        label: 'filter',
        group: 'group',
      },
    ]
    const expected = [...inits, ...diffs]
    expect(mergeState(inits, diffs)).toEqual(expected)
  })
})

describe('parseState(state, endpoint)', () => {
  const state = []
  const [include, where, base] = parseState(state, 'documents')
})