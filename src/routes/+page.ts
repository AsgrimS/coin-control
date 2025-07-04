import { commands } from "$lib/bindings"
import { info } from "@tauri-apps/plugin-log"
import type { PageLoad } from "./$types"

export const load: PageLoad = async () => {
  const budget = await commands.getBudgetById(1)
  info(`Loaded budget: ${JSON.stringify(budget)}`)

  return {
    budget: budget.status === "ok" ? budget.data : null,
  }
}
