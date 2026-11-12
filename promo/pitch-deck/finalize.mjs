import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { buildDir, outputDir, root } from './prepare.mjs';

const runtime = path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies');
process.env.RUNTIME_NODE_MODULES ||= path.join(runtime, 'node/node_modules');
const skillDir = path.join(os.homedir(), '.codex/plugins/cache/openai-primary-runtime/presentations/26.1024.11018/skills/presentations');
const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, 'container_tools/artifact_tool_utils.mjs')).href);
const finalPath = path.join(outputDir, globalThis.process?.argv[2] || 'katalhys-pitch-id-v5.pptx');
const result = await finalizePresentation({
  workspaceDir: root,
  candidatePath: path.join(buildDir, 'animated-v5.pptx'),
  finalPath,
  explicitTotalSlideCount: 37,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  pythonExecutable: path.join(runtime, 'python/python.exe'),
  integrityValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(skillDir, 'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs: ['--expected-slide-size-emu', '12192000,6858000', '--validate-bullet-geometry', '--validate-heading-fit'],
  fontPolicy: { basis: 'design', families: ['General Sans', 'Inter'] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(buildDir, 'validation-v5.json'),
});
await fs.access(finalPath);
console.log(JSON.stringify(result));
process.exit(0);
