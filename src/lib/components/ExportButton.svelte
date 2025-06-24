<script lang="ts">
	import FileSaver from 'file-saver';
	import * as gpx from 'gpx.studio/gpx/src/index';
	import { slide } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import { route } from '$lib/state/route.svelte';

	let bufferSize = $state(10);

	async function download() {
		const fileData = route.file();

		if (fileData !== null && fileData.length > 0) {
			const blob = new Blob([gpx.buildGPX(fileData[0], [])], { type: 'application/gpx+xml' });

			FileSaver.saveAs(blob, `${fileData[0].metadata.name}-hydrated.gpx`);
		}
	}
</script>

{#if route?.file() !== null}
	<div transition:slide>
		<Label for="bufferSize">{bufferSize}</Label>
		<Slider id="bufferSize" type="single" bind:value={bufferSize} max={100} min={1} step={1} />

		<div class="flex place-content-center py-6">
			<Button onClickPromise={download} size="lg">{m.downloadNewGpx()}</Button>
		</div>
	</div>
{/if}
