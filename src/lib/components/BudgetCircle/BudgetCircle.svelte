<script lang="ts">
  import { ProgressRing } from "@skeletonlabs/skeleton-svelte"
  import Coins from "lucide-svelte/icons/coins"

  interface Props {
    currentSpendings: number
    budget: number
  }

  let { budget, currentSpendings }: Props = $props()
</script>

<div class="grid grid-cols-1 justify-center gap-4">
  <ProgressRing value={currentSpendings} max={budget}>
    <Coins size={48} />
  </ProgressRing>
</div>
