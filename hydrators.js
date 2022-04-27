const legacyMethodHydrator = async (z, bundle) => {
  return z.legacyScripting.run(bundle, 'hydrate.method');
};

const legacyFileHydrator = async (z, bundle) => {
  return z.legacyScripting.run(bundle, 'hydrate.file');
};

module.exports = {
  legacyMethodHydrator: legacyMethodHydrator,
  legacyFileHydrator: legacyFileHydrator,
};
