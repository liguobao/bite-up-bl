import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repository = process.env.GITHUB_REPOSITORY;
const repoName = repository?.split('/')?.[1] ?? '';
const base = repository ? `/${repoName}/` : '/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
});
