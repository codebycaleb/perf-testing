const perform = async (z, bundle) => {
  return z.legacyScripting.run(bundle, 'trigger', 'perf_test');
};

module.exports = {
  key: 'perf_test',
  noun: 'Test',
  display: {
    label: 'Test Performance',
    description: 'Tests logging performance.',
    important: true,
    hidden: false,
  },
  operation: {
    perform: perform,
    inputFields: [],
    outputFields: [],
    sample: { id: 1 },
  },
};
