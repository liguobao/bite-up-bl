interface BuildInfo {
  commitHash: string;
  shortCommitHash: string;
  commitDate: string;
  commitAuthor: string;
  commitMessage: string;
  builtAt: string;
}

declare const __BUILD_INFO__: BuildInfo;
