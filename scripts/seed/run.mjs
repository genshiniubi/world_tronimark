import { seedCore } from './core.mjs';
import { seedCppProblems } from './cpp.mjs';
import { seedPythonProblems } from './python.mjs';
import { seedAlgorithmProblems } from './algorithms.mjs';
import { seedAdvancedProblems } from './advanced.mjs';
import { finish } from './helpers.mjs';

await seedCore();
await seedCppProblems();
await seedPythonProblems();
await seedAlgorithmProblems();
await seedAdvancedProblems();
await finish();
