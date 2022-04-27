var Zap = {
  perf_test_post_poll: function (bundle) {
    console.time('perf_test_post_poll');
    const result = z.JSON.parse(bundle.response.content)
      .slice(0, 500)
      .map((photo) => ({
        ...photo,
        signature: crypto.randomUUID(),
      }));
    console.timeEnd('perf_test_post_poll');
    return result;
  },
};
