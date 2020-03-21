import { GitErrorType } from "~/types";

/**
 * Error class that represents any error that can happen when interacting
 * with git
 */
export class GitError extends Error {
  public readonly code: GitErrorType;

  constructor(message: string, code: GitErrorType) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
  }
}
