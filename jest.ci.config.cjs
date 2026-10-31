const { jest: baseConfig } = require('./package.json');

module.exports = {
  ...baseConfig,
  // Exclusão local a estas duas suites, por decisão explícita do utilizador.
  // Os restantes testes continuam a ser descobertos normalmente pela CI.
  testPathIgnorePatterns: [
    ...(baseConfig.testPathIgnorePatterns ?? ['node_modules']),
    '<rootDir>/src/shared/ui/Button/Button\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/theme/ThemeProvider\\.test\\.tsx$',
  ],
};
