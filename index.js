const perfTestTrigger = require('./triggers/perf_test.js');
const hydrators = require('./hydrators');

const fs = require('fs');
const scriptingSource = fs.readFileSync('./scripting.js', { encoding: 'utf8' });

const beforeRequest = async (request, z, bundle) => {
  return z.legacyScripting.beforeRequest(request, z, bundle);
};

const afterResponse = async (response, z, bundle) => {
  return z.legacyScripting.afterResponse(response, z, bundle);
};

module.exports = {
  beforeRequest: [beforeRequest],
  afterResponse: [afterResponse],
  triggers: { [perfTestTrigger.key]: perfTestTrigger },
  creates: {},
  searches: {},
  hydrators: hydrators,
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  legacy: {
    authentication: { mapping: {}, placement: 'header' },
    triggers: {
      perf_test: {
        operation: { url: 'https://jsonplaceholder.typicode.com/photos' },
      },
    },
    creates: {},
    searches: {},
    scriptingSource: scriptingSource,
    loadCustomFieldsEarly: false,
    needsFlattenedData: false,
    needsTriggerData: false,
  },
  flags: { skipThrowForStatus: true },
};
