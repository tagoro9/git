import simplegit = require("simple-git");
import { git } from "~/index";
import { GitErrorType } from "~/types";

const simpleGitMock = (simplegit as unknown) as jest.Mock;

jest.mock("simple-git");

const branchName = "f/my-fancy-branch";
const remote = "git@github.com:tagoro9/git.git";

const gitMocks = {
  revparse: jest.fn().mockResolvedValue(branchName),
  getRemotes: jest.fn().mockResolvedValue([
    {
      name: "origin",
      refs: {
        fetch: remote,
        push: remote,
      },
    },
  ]),
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

  describe("getRemote", () => {
    it("should return the parsed remote", async () => {
      await expect(git.getRemote("origin")).resolves.toMatchSnapshot();
      expect(gitMocks.getRemotes).toHaveBeenCalledWith(true);
    });

    it("should fall back to the first remote if it cannot find the specified one", async () => {
      await expect(git.getRemote("some_remote")).resolves.toMatchSnapshot();
      expect(gitMocks.getRemotes).toHaveBeenCalledWith(true);
    });

    it("should throw an error if there are no remotes", async () => {
      gitMocks.getRemotes.mockResolvedValue([]);
      await expect(
        git.getRemote("origin")
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
