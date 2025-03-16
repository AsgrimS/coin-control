<script lang="ts">
  import { Modal } from "@skeletonlabs/skeleton-svelte"
  import Plus from "lucide-svelte/icons/plus"
  import ArrowDown from "lucide-svelte/icons/arrow-down"
  import { LoadingRing } from "$lib/components"

  interface Props {
    isLoading?: boolean
  }

  let { isLoading = false }: Props = $props()

  let drawerState = $state(false)

  function drawerClose() {
    drawerState = false
  }
</script>

<Modal
  open={drawerState}
  onOpenChange={(e) => (drawerState = e.open)}
  triggerBase="btn-icon size-[64px] text-primary-500 preset-outlined-primary-500"
  contentBase="bg-surface-100-900 shadow-xl h-[240px] p-4 w-full max-w-[560px] rounded-t-lg flex items-center flex-col gap-4 justify-center"
  transitionsPositionerIn={{ y: 240, duration: 200 }}
  transitionsPositionerOut={{ y: 240, duration: 200 }}
  positionerJustify="justify-center"
  positionerAlign="items-end"
  positionerPadding="p-0"
  closeOnInteractOutside={!isLoading}
>
  {#snippet trigger()}
    <Plus size={64} />
  {/snippet}
  {#snippet content()}
    {#if isLoading}
      <LoadingRing size="size-32" />
    {:else}
      <header class="flex justify-center">
        <h2 class="h2">Add Expense</h2>
      </header>
      <article>
        <p class="opacity-60">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, ab adipisci. Libero cumque sunt quis error
          veritatis amet, expedita voluptatem. Quos repudiandae consequuntur voluptatem et dicta quas, reprehenderit
          velit excepturi?
        </p>
      </article>
      <footer>
        <button type="button" class="btn" onclick={drawerClose}><ArrowDown /></button>
      </footer>
    {/if}
  {/snippet}
</Modal>
