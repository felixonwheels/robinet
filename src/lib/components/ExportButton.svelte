<script lang="ts">
	import { XMLBuilder } from 'fast-xml-parser';
	import FileSaver from 'file-saver';
	import { slide } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages.js';
	import { file } from '$lib/state.svelte';
	import { selectedWaterSources, waterSources } from '$lib/state.svelte';
	import type { WayPoint } from '$lib/types';

	async function download() {
		if (file.value !== null) {
			const waypoints = waterSources.value
				?.filter((source) => selectedWaterSources.value?.has(source.id))
				.map((waterSource) => ({
					attributes: {
						lat: waterSource.lat,
						lon: waterSource.lon
					},
					name: m.waterSource(),
					sym: 'Water Source'
				})) as WayPoint[];

			file.value.wpt = [...(file.value?.wpt ?? []), ...waypoints];

			let lastDate: Date | undefined = undefined;

			const builder = new XMLBuilder({
				format: true,
				ignoreAttributes: false,
				attributeNamePrefix: '',
				attributesGroupName: 'attributes',
				suppressEmptyNode: true,
				tagValueProcessor: (tagName: string, tagValue: any): string | undefined => {
					if (tagValue instanceof Date) {
						if (isNaN(tagValue.getTime())) {
							return lastDate?.toISOString();
						}
						lastDate = tagValue;
						return tagValue.toISOString();
					}
					return tagValue.toString();
				}
			});

			const builtGpx = builder.build({
				'?xml': {
					attributes: {
						version: '1.0',
						encoding: 'UTF-8'
					}
				},
				gpx: file.value
			});

			FileSaver.saveAs(
				new Blob([builtGpx], { type: 'application/gpx+xml' }),
				`${file.value.metadata?.name ?? file.value.metadata?.author}-hydrated.gpx`
			);
		}
	}
</script>

{#if (selectedWaterSources.value?.size ?? 0) > 0}
	<div transition:slide>
		<div class="flex place-content-center py-6 overflow-auto">
			<Button onClickPromise={download} size="lg">{m.downloadNewGpx()}</Button>
		</div>
	</div>
{/if}
