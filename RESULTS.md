| branch/test                                    | result               |
|------------------------------------------------|----------------------|
| zapier-platform-core@9.7.3 (42401733)          | `perf_test: 4.587s`  |
| zapier-platform-core@12.0.2 (82b496e7)         | `perf_test: 16.962s` |
| main   (f2f152d3)                              | `perf_test: 18.438s` |
| main   (with secret-scrubber improvement)      | `perf_test: 15.342s` |
| CRIT-371-faster-cleaner                   [1a] | `perf_test: 4.536s`  |
| main   (stringify, truncate, parse)       [1b] | `perf_test: 4.553s`  |
| main   (stringified)                       [2] | `perf_test: 4.517s`  |
| main   (only as-is transform)              [4] | `perf_test: 10.176s` |

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

### Secret-scrubber improvement

For this one, I manually implemented https://gitlab.com/zapier/team-developer-platform/secret-scrubber-js/-/merge_requests/7 in my `node_modules` install of secret-scrubber. It helped, but not as much as I thought it would.

NOTE: Combining this with [1a] or [1b] shortens the results time to less than 1 second! Combining it with [2] brought the time to a little over 1 second. 😲

### CRIT-371-faster-cleaner [1a]

For this one, I checked out the branch from https://github.com/zapier/zapier-platform/pull/542.

### Stringify, truncate, parse [1b]

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

### Stringified [2]

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

### Only as-is transform [4]

I commented out the 4 `transform.add` lines in secret-scrubber's `utils.js`. It definitely helped, but not as much as I thought it would!