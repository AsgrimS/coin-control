<script lang="ts">
  import { Modal } from "@skeletonlabs/skeleton-svelte"
  import Settings from "lucide-svelte/icons/settings"

  let drawerState = $state(false)

  function drawerClose() {
    drawerState = false
  }
</script>

<Modal
  bind:open={drawerState}
  triggerBase={`btn-icon size-[64px]`}
  contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[480px] h-screen flex flex-col gap-4 justify-between"
  positionerJustify="justify-end"
  positionerPadding="p-0"
  transitionsPositionerIn={{ x: 480, duration: 200 }}
  transitionsPositionerOut={{ x: 480, duration: 200 }}
>
  {#snippet trigger()}
    <Settings size={64} />
  {/snippet}
  {#snippet content()}
    <header class="flex justify-between">
      <h2 class="h2">Settings</h2>
    </header>
    <article>
      <p class="opacity-60">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, ab adipisci. Libero cumque sunt quis error
        veritatis amet, expedita voluptatem. Quos repudiandae consequuntur voluptatem et dicta quas, reprehenderit velit
        excepturi?
      </p>
    </article>
    <footer>
      <button type="button" class="btn preset-filled" onclick={drawerClose}>Close Drawer</button>
    </footer>
  {/snippet}
</Modal>
