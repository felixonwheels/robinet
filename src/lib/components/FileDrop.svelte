<script lang="ts">
	import { UploadIcon, XIcon } from '@lucide/svelte';
	import { XMLParser } from 'fast-xml-parser';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { FileDropZone, type FileDropZoneProps } from '$lib/components/ui/file-drop-zone';
	import { Input } from '$lib/components/ui/input/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import { file, gpxFileName, selectedWaterSources, waterSources } from '$lib/state.svelte';
	import type { GPXBuildData } from '$lib/types';
	import { attributesWithNamespace, safeParseFloat } from '$lib/utils';

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		const mainFile = uploadedFiles[0];

		const content = await mainFile.text();

		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: '',
			attributesGroupName: 'attributes',
			removeNSPrefix: true,
			isArray(name: string) {
				return (
					name === 'trk' ||
					name === 'trkseg' ||
					name === 'trkpt' ||
					name === 'wpt' ||
					name === 'rte' ||
					name === 'rtept' ||
					name === 'gpxx:rpt'
				);
			},
			attributeValueProcessor(attrName, attrValue, jPath) {
				if (attrName === 'lat' || attrName === 'lon') {
					return safeParseFloat(attrValue);
				}
				return attrValue;
			},
			transformTagName(tagName: string) {
				if (Object.hasOwn(attributesWithNamespace, tagName)) {
					return attributesWithNamespace[tagName];
				}
				return tagName;
			},
			parseTagValue: false,
			tagValueProcessor(tagName, tagValue, jPath, hasAttributes, isLeafNode) {
				if (isLeafNode) {
					if (tagName === 'ele') {
						return safeParseFloat(tagValue);
					}

					if (tagName === 'time') {
						return new Date(tagValue);
					}

					if (
						tagName === 'gpxtpx:atemp' ||
						tagName === 'gpxtpx:hr' ||
						tagName === 'gpxtpx:cad' ||
						tagName === 'gpxpx:PowerInWatts' ||
						tagName === 'gpx_style:opacity' ||
						tagName === 'gpx_style:width'
					) {
						return safeParseFloat(tagValue);
					}

					if (tagName === 'gpxpx:PowerExtension') {
						return {
							'gpxpx:PowerInWatts': safeParseFloat(tagValue)
						};
					}
				}

				return tagValue;
			}
		});

		let gpx = parser.parse(content).gpx as GPXBuildData;

		file.setValue(gpx);

		gpxFileName.setValue(gpx?.metadata?.name ?? '-');
		gpxNameLocal = gpx?.metadata?.name ?? '-';

		const pointCount =
			gpx.trk?.reduce((sum, trk) => {
				return (
					sum + (trk.trkseg ?? []).reduce((segSum, seg) => segSum + (seg.trkpt?.length || 0), 0) ||
					0
				);
			}, 0) || 0;

		toast.success(m.filePoints({ count: pointCount }));
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(m.uploadErrorFailToUpload({ name: file.name }), { description: reason });
	};

	let gpxNameLocal = $state('');

	$effect(() => {
		if (gpxNameLocal !== gpxFileName.value) {
			gpxFileName.setValue(gpxNameLocal);
		}
	});
</script>

{#if file.value === null}
	<div transition:slide>
		<FileDropZone
			{onUpload}
			{onFileRejected}
			maxFiles={1}
			accept=".gpx"
			fileCount={file.value !== null ? 1 : 0}
		>
			<div class="flex flex-col place-items-center justify-center gap-4">
				<div
					class="border-border text-muted-foreground flex size-14 place-items-center justify-center rounded-full border border-dashed"
				>
					<UploadIcon class="size-7" />
				</div>

				<div class="flex flex-col gap-0.5 text-center">
					<span class="text-muted-foreground font-medium">
						{m.dragAndDrop()}
					</span>
				</div>
			</div>
		</FileDropZone>
	</div>
{:else}
	<Card.Root>
		<Card.Content class="flex w-full place-items-center justify-between">
			<Input
				bind:value={gpxNameLocal}
				class="text-muted-foreground font-medium overflow-auto mr-2"
			/>
			<Button
				variant="outline"
				size="icon"
				onclick={() => {
					file.setValue(null);
					waterSources.setValue(null);
					selectedWaterSources.setSelectedWaterSources(null);
				}}
			>
				<XIcon />
			</Button>
		</Card.Content>
	</Card.Root>
{/if}
