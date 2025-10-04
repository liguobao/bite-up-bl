import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

interface BuildInfo {
  commitHash: string;
  shortCommitHash: string;
  commitDate: string;
  commitAuthor: string;
  commitMessage: string;
  builtAt: string;
}

const createBuildInfo = (): BuildInfo => {
  const safeExec = (command: string) => {
    try {
      return execSync(command, { stdio: 'pipe' }).toString().trim();
    } catch (error) {
      return '';
    }
  };

  return {
    commitHash: safeExec('git rev-parse HEAD'),
    shortCommitHash: safeExec('git rev-parse --short HEAD'),
    commitDate: safeExec('git show -s --format=%cI HEAD'),
    commitAuthor: safeExec("git show -s --format='%an <%ae>' HEAD"),
    commitMessage: safeExec('git show -s --format=%s HEAD'),
    builtAt: new Date().toISOString(),
  };
};

const gitBuildInfoPlugin = (info: BuildInfo) => {
  let outputDir = 'dist';
  let rootDir = process.cwd();

  return {
    name: 'vite-plugin-git-build-info',
    apply: 'build' as const,
    configResolved(resolvedConfig: { build: { outDir: string }; root: string }) {
      outputDir = resolvedConfig.build.outDir;
      rootDir = resolvedConfig.root;
    },
    closeBundle() {
      const filePath = join(rootDir, outputDir, 'build-info.json');
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, JSON.stringify(info, null, 2), 'utf8');
    },
  };
};

export default defineConfig(() => {
  const repository = process.env.GITHUB_REPOSITORY;
  const repoName = repository?.split('/')?.[1] ?? '';
  const base = repository ? `/${repoName}/` : '/';
  const buildInfo = createBuildInfo();

  return {
    plugins: [react(), gitBuildInfoPlugin(buildInfo)],
    base,
    define: {
      __BUILD_INFO__: JSON.stringify(buildInfo),
    },
  };
});
