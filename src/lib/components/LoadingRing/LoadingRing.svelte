<script lang="ts">
  import { ProgressRing } from "@skeletonlabs/skeleton-svelte"

  interface Props {
    size?: string
  }

  let { size = "size-24" }: Props = $props()
</script>

<ProgressRing value={null} {size} meterStroke="stroke-tertiary-600-400" trackStroke="stroke-tertiary-50-95" />
