<script lang="ts">
  import "../app.css"
  import { SettingsDrawer } from "$lib/components"
  import { AddExpenseDrawer } from "$lib/components"
  import Coins from "lucide-svelte/icons/coins"

  let { children } = $props()
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
  <header class="sticky top-0 z-10 flex justify-end p-4"><SettingsDrawer /></header>
  <main>
    <div class="fixed inset-0 -z-10 flex items-center justify-center">
      <Coins size={256} class="text-surface-900" />
    </div>
    {@render children()}
  </main>
  <footer class="flex justify-center p-4"><AddExpenseDrawer /></footer>
</div>
