<script lang="ts">
	import { ProgressRadial } from "@skeletonlabs/skeleton"

	export let spent: number
	export let limit: number

	const getProgressColor = (progress: number) => {
		if (progress < 90) {
			return "stroke-primary-500"
		} else if (progress < 100) {
			return "stroke-warning-500"
		} else {
			return "stroke-error-500"
		}
	}

	const getTrackColor = (progress: number) => {
		if (progress < 90) {
			return "stroke-primary-500/30"
		} else if (progress < 100) {
			return "stroke-warning-500/30"
		} else {
			return "stroke-error-500/30"
		}
	}

	$: percentageSpent = (spent / limit) * 100
	$: meterClass = getProgressColor(percentageSpent)
	$: trackClass = getTrackColor(percentageSpent)
</script>

<ProgressRadial value={Math.min(percentageSpent, 100)} meter={meterClass} track={trackClass}>
	$ {spent.toFixed(2)} / {limit.toFixed(2)}
</ProgressRadial>
