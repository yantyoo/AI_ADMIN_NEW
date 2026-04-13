import { getAccountsData } from "@/api/accounts";
import { AccountsPanel } from "@/features/accounts/accounts-panel";

export async function AccountsPage() {
  const { accounts, stats } = await getAccountsData();

  return <AccountsPanel accounts={accounts} />;
}
