import simpleGit = require("simple-git/promise");
import { SimpleGit } from "simple-git/promise";

import { GitError } from "~/GitError";
import { GitErrorType } from "~/types";

/**
 * Get a git instance
 */
function getGit(): SimpleGit {
  return simpleGit().silent(true);
}

/**
 * Given an error from git, try to parse it into a more readable error and
 * throw the new error
 * @param e Error
 */
function mapAndThrowError(e: Error): never {
  if (e.message.match(/not a git repository/)) {
    throw new GitError(e.message, GitErrorType.NOT_A_GIT_REPO);
  }
  throw e;
}

export const git = {
  /**
   * Get the name of the current branch
   */
  getCurrentBranchName(): Promise<string> {
    const git = getGit();
    return git.revparse(["--abbrev-ref", "HEAD"]).catch(mapAndThrowError);
  },
};
