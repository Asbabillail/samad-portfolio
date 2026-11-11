import { permanentRedirect } from "next/navigation";

/**
 * The A4.s03 dashboard has been retired to avoid a duplicate portfolio.
 * Old /github links permanently resolve to the main professional portfolio.
 * The actual GitHub profile is maintained at github.com/Asbabillail.
 */
export default function RetiredGithubDashboard() {
  permanentRedirect("/");
}
