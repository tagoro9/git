import simplegit = require("simple-git/promise");
import { git } from "~/index";
import { GitErrorType } from "~/types";

const simpleGitMock = (simplegit as unknown) as jest.Mock;

jest.mock("simple-git/promise");

const branchName = "f/my-fancy-branch";

const gitMocks = {
  revparse: jest.fn().mockResolvedValue(branchName),
};

describe("git", () => {
  beforeEach(() => {
    simpleGitMock.mockReturnValue({ silent: () => gitMocks });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrentBranchName", () => {
    test("returns the current branch name", async () => {
      await expect(git.getCurrentBranchName()).resolves.toMatchInlineSnapshot(
        `"f/my-fancy-branch"`
      );
      expect(gitMocks.revparse).toHaveBeenCalled();
      expect(gitMocks.revparse.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Array [
            "--abbrev-ref",
            "HEAD",
          ],
        ]
      `);
    });

    test("throws an error when not on a git repo", async () => {
      gitMocks.revparse.mockRejectedValue(
        new Error(
          "fatal: not a git repository (or any of the parent directories): .git"
        )
      );
      await expect(git.getCurrentBranchName()).rejects.toHaveProperty(
        "code",
        GitErrorType.NOT_A_GIT_REPO
      );
    });
  });
});
