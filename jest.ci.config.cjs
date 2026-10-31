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
    '<rootDir>/src/shared/ui/TextField/TextField\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/FormField/FormField\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/Checkbox/Checkbox\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/Radio/Radio\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/RadioGroup/RadioGroup\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/Switch/Switch\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/CheckboxGroup/CheckboxGroup\\.test\\.tsx$',
    '<rootDir>/src/shared/ui/ProgressBar/ProgressBar\\.test\\.tsx$',
  ],
};
