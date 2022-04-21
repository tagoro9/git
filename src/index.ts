import gitUrlParse = require("git-url-parse");
import simpleGit, { SimpleGit } from "simple-git";

import { GitError } from "~/GitError";
import { GitErrorType, GitRemote } from "~/types";

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

  /**
   * Get the remote information. Fallback to the first found remote if none
   * with the specified name can be found
   * @param name Remote name
   */
  getRemote(name: string): Promise<gitUrlParse.GitUrl> {
    const git = getGit();
    return git.getRemotes(true).then((remotes: GitRemote[]) => {
      const origin = remotes.find((remote: GitRemote) => remote.name === name);
      const firstRemote = remotes[0];

      if (!origin && !firstRemote) {
        throw new GitError(
          `Could not find a remote with name "${name}"`,
          GitErrorType.REMOTE_NOT_FOUND
        );
      }

      return gitUrlParse((origin || firstRemote).refs.fetch);
    });
  },
};
