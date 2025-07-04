<script lang="ts">
  import { BudgetCircle } from "$lib/components"
  import type { PageProps } from "./$types"

  let { data }: PageProps = $props()
</script>

<!-- Content -->
<div class="flex h-full items-center justify-center">
  <!-- <Coins size={128} class="text-surface-900" /> -->
  {#if data.budget}
    <div class="grid grid-cols-1 justify-center gap-4">
      <BudgetCircle balance={data.budget.balance} allowance={data.budget.allowance} />
    </div>
  {:else}
    <p class="text-surface-900">No budget set</p>
  {/if}
</div>
