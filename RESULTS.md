| branch/test                                  | result               |
|----------------------------------------------|----------------------|
| zapier-platform-core@9.7.3 (42401733)        | `perf_test: 4.587s`  |
| zapier-platform-core@12.0.2 (82b496e7)       | `perf_test: 16.962s` |
| master (f2f152d3)                            | `perf_test: 18.438s` |
| master (with secret-scrubber improvement)    | `perf_test: 15.342s` |
| CRIT-371-faster-cleaner                      | `perf_test: 4.536s`  |
| master (stringify, truncate, parse)          | `perf_test: 4.553s`  |
| master (stringified)                         | `perf_test: 4.517s`  |
| master (only as-is transform)                | `perf_test: 10.176s` |

---

For the following implementations, `quickCensor` is called in the following fashion:

```
  // bundle logs only really have the input / output that needs censored; http logs need a lot of fields censored
  if (data.log_type === 'bundle') {
    data.input = quickCensor(data.input, sensitiveValues);
    data.output = quickCensor(data.output, sensitiveValues);
  }
  if (data.log_type === 'http') {
    data = quickCensor(data, sensitiveValues);
  }
```

It's called after `sensitiveValues` is built and before scrubbing / truncating `message`. `safeData` and `unsafeData` are now defined as:

```
  const safeData = recurseReplace(data, truncate);
  const unsafeData = data;
```

---

### Stringify, truncate, parse

```
const quickCensor = (obj, sensitiveValues) => {
  if (!obj) {
    return obj;
  }
  const stringified = JSON.stringify(obj);
  const truncated = simpleTruncate(stringified, 3500);
  const parsed = partialParse(truncated);
  const censored = scrub(parsed, sensitiveValues);
  return censored;
};
```

NOTE: The partialParse implementation doesn't account for `null` values, so I had to tweak a line of it to get this working. 😅 Also, this code would not account for SAFE_LOG_KEYS.

### Stringified

```
const quickCensor = (obj, sensitiveValues) => {
  if (!obj) {
    return obj;
  }
  const stringified = JSON.stringify(obj);
  const censored = scrub(stringified, sensitiveValues);
  return JSON.parse(censored);
};
```

NOTE: This implementation is incomplete, as number values that are replaced will fail JSON validation and "SAFE_LOG_KEYS" will be censored.

### Only as-is transform

I commented out the 4 `transform.add` lines in secret-scrubber's `utils.js`. It definitely helped, but not as much as I thought it would!