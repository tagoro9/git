import { Commit } from "conventional-commits-parser";

export interface Remote {
  name: string;
  refs: {
    fetch: string;
    push: string;
  };
}

export interface GitLogLine {
  author_email: string;
  author_name: string;
  date: string;
  hash: string;
  message: string;
}

export interface GitLog {
  all: ReadonlyArray<GitLogLine>;
  latest: GitLogLine;
  total: number;
}

export interface BranchInfo {
  commits: Commit[];
  issues: Commit.Reference[];
  name: string;
}

export enum GitErrorType {
  NOT_A_GIT_REPO,
}
