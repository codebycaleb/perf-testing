require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('triggers.perf_test', () => {
  it('should run', async () => {
    const bundle = {
      inputData: {},
      authData: {
        username: 'voluptatem',
        password: 'consequatur',
      },
    };

    console.time('perf_test');
    const results = await appTester(
      App.triggers['perf_test'].operation.perform,
      bundle
    );
    console.timeEnd('perf_test');
    results.should.be.an.Array();
  });
});
