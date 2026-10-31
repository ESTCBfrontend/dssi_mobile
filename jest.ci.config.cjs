const { jest: baseConfig } = require('./package.json');

module.exports = {
  ...baseConfig,
  // Estas suites de componentes executam-se apenas localmente, por decisão do utilizador.
  // Os restantes testes continuam a ser descobertos normalmente pela CI.
  testPathIgnorePatterns: [
    ...(baseConfig.testPathIgnorePatterns ?? ['node_modules']),
    '<rootDir>/src/shared/ui/Button/Button\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/theme/ThemeProvider\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/StatusBadge/StatusBadge\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/AlertIcon/AlertIcon\\.test\\.tsx$',
  ],
};
