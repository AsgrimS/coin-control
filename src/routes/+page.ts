import { commands } from "$lib/bindings"
import { info } from "@tauri-apps/plugin-log"
import type { PageLoad } from "./$types"

export const load: PageLoad = async () => {
  const budgets = await commands.getAllBudgets()
  info(`Loaded budget: ${JSON.stringify(budgets)}`)

  return {
    budget: budgets.status === "ok" ? (budgets.data[0] ?? null) : null,
  }
}
