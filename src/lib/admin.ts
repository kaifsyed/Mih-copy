import "server-only";

/**
 * Admin authorization.
 *
 * The allowlist comes from ADMIN_USER_IDS — a server-only, comma-separated list
 * of Clerk user IDs. Keeping it in the environment means admins can be added or
 * rotated without a code change, and no account identifier is committed to Git.
 *
 * It FAILS CLOSED: if ADMIN_USER_IDS is unset or empty, nobody is an admin.
 * That is deliberate. A misconfiguration must lock the admin out, never let
 * every signed-in visitor in.
 *
 * This is authorization only. Authentication is Clerk's job, and the edge gate
 * in src/proxy.ts guarantees a session exists before these checks run.
 */
function getAllowlist(): string[] {
  // Read at call time, not module load, so a cold start that initialises before
  // the environment is populated cannot cache an empty allowlist.
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;

  const allowlist = getAllowlist();

  if (allowlist.length === 0) {
    console.error(
      "ADMIN_USER_IDS is not configured — denying all admin access. " +
        "Set it to a comma-separated list of Clerk user IDs.",
    );
    return false;
  }

  return allowlist.includes(userId.trim());
}
