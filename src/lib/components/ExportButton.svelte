<script lang="ts">
	import FileSaver from 'file-saver';
	import * as gpx from 'gpx.studio/gpx/src/index';
	import { slide } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages.js';
	import { file } from '$lib/state.svelte';
	import { waterSources } from '$lib/state.svelte';

	async function download() {
		const fileData = file.value;

		if (fileData !== null && fileData.length > 0) {
			const blob = new Blob([gpx.buildGPX(fileData[0], [])], { type: 'application/gpx+xml' });

			FileSaver.saveAs(blob, `${fileData[0].metadata.name}-hydrated.gpx`);
		}
	}
</script>

{#if waterSources.value?.length}
	<div transition:slide>
		<div class="flex place-content-center py-6 overflow-auto">
			<Button onClickPromise={download} size="lg">{m.downloadNewGpx()}</Button>
		</div>
	</div>
{/if}
