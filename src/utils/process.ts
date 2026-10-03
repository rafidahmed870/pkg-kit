import { execSync, spawnSync } from "child_process";

/**
 * Checks whether a CLI tool is available in PATH.
 */
export function isCommandAvailable(command: string): boolean {
  try {
    // "command -v" is POSIX; on Windows we rely on where.exe via spawnSync
    const result = spawnSync(process.platform === "win32" ? "where" : "which", [command], {
      stdio: "ignore",
      shell: false,
    });
    return result.status === 0;
  } catch {
    return false;
  }
}

/**
 * Checks whether Git is available and initialised.
 */
export function isGitAvailable(): boolean {
  return isCommandAvailable("git");
}

/**
 * Runs a shell command synchronously in a given directory.
 * Returns { success, output, error }.
 */
export function runCommand(
  command: string,
  cwd: string,
): { success: boolean; output: string; error: string } {
  try {
    const output = execSync(command, {
      cwd,
      stdio: "pipe",
      encoding: "utf-8",
    });
    return { success: true, output: output ?? "", error: "" };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "stderr" in err) {
      return {
        success: false,
        output: "",
        error: String((err as { stderr: unknown }).stderr ?? err),
      };
    }
    return { success: false, output: "", error: String(err) };
  }
}

/**
 * Runs a command and streams its output to the terminal (inherits stdio).
 * Use this for package manager install so the user sees progress.
 */
export function runCommandInherited(command: string, cwd: string): boolean {
  try {
    execSync(command, { cwd, stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
}
