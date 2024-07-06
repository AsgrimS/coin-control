<script>
	import { ProgressRadial } from "@skeletonlabs/skeleton"

	export let width = "w-36"
	export let color = "stroke-primary-500"
</script>

<ProgressRadial {width} meter={color} track={`${color}/30`} />
