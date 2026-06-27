import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPackageEslintConfig } from '../../eslint.shared.mjs';

const packageDir = path.dirname(fileURLToPath(import.meta.url));

export default createPackageEslintConfig(packageDir, {
  eslintTsconfig: path.join(packageDir, 'tsconfig.eslint.json'),
});
