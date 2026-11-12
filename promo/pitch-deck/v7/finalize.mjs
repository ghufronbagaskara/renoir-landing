import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const runtime=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies');
const skill=path.join(os.homedir(),'.codex/plugins/cache/openai-primary-runtime/presentations/26.1025.11240/skills/presentations');
process.env.RUNTIME_NODE_MODULES=path.join(runtime,'node/node_modules');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const manifest=JSON.parse(await fs.readFile(path.join(root,'.build/v7/manifest.json'),'utf8'));
const result=await finalizePresentation({
 workspaceDir:root,candidatePath:path.join(root,'.build/v7/candidate.pptx'),finalPath:path.join(root,'output/katalhys-pitch-id-v7.pptx'),explicitTotalSlideCount:40,
 requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],pythonExecutable:path.join(runtime,'python/python.exe'),
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
 fontPolicy:{basis:'reference',families:['General Sans','Inter'],referencePath:manifest.base,referenceSha256:manifest.baseHash},
 verifyArtifactToolImport:true,receiptPath:path.join(root,'.build/v7/validation.json'),
});
console.log(JSON.stringify(result));process.exit(0);
