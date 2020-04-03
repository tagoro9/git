export interface GitRemote {
  name: string;
  refs: {
    fetch: string;
    push: string;
  };
}

export enum GitErrorType {
  NOT_A_GIT_REPO,
  REMOTE_NOT_FOUND,
}
