<script lang="ts">
  import { ProgressRing } from "@skeletonlabs/skeleton-svelte"
  import Coins from "lucide-svelte/icons/coins"

  interface Props {
    balance: number
    allowance: number
  }

  let { allowance, balance }: Props = $props()
</script>

<div class="grid grid-cols-1 justify-center gap-4">
  <ProgressRing value={allowance - balance} max={allowance}>
    <Coins size={48} />
  </ProgressRing>
</div>
