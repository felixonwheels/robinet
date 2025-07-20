<script lang="ts">
	import { UploadIcon, XIcon } from '@lucide/svelte';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { fade, slide } from 'svelte/transition';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import {
		bufferSize,
		file,
		gpxFileName,
		overpassPolygons,
		selectedWaterSources,
		trackBBoxMinLength,
		tracks,
		tracksBuffers,
		waterSources
	} from '$lib/state.svelte';
	import type { GPXBuildData } from '$lib/types';
	import { parser } from '$lib/utils';

	let gpxNameLocal = $state('');
	let uploading = $state(false);
	let disabled = $state(false);

	const onUpload = async (uploadedFile: File) => {
		await tick();

		uploading = true;

		try {
			const content = await uploadedFile.text();

			const parsedValue = parser.parse(content);

			if (Object.hasOwn(parsedValue, 'gpx')) {
				let gpx = parser.parse(content).gpx as GPXBuildData;

				file.value = gpx;

				const name = gpx?.metadata?.name ?? uploadedFile?.name ?? '-';

				gpxFileName.value = name;
				gpxNameLocal = name;

				uploading = false;

				const pointsCount =
					gpx.trk?.reduce((sum, trk) => {
						return (
							sum +
								(trk.trkseg ?? []).reduce((segSum, seg) => segSum + (seg.trkpt?.length || 0), 0) ||
							0
						);
					}, 0) || 0;

				toast.success(m.filePoints({ count: pointsCount }));
			} else {
				toast.error(m.uploadErrorFailToUpload({ name: uploadedFile.name }));
			}
		} catch (err) {
			toast.error(m.uploadErrorFailToUpload({ name: uploadedFile.name }));
		} finally {
			uploading = false;
		}
	};

	const drop = async (
		e: DragEvent & {
			currentTarget: EventTarget & HTMLLabelElement;
		}
	) => {
		if (disabled || !canUploadFiles) return;

		e.preventDefault();

		const droppedFile = e.dataTransfer?.files.item(0);

		if (droppedFile !== null && droppedFile !== undefined) {
			await onUpload(droppedFile);
		}
	};

	const change = async (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		if (disabled) return;

		const selectedFile = e.currentTarget.files?.item(0);

		if (!selectedFile) return;

		await onUpload(selectedFile);

		(e.target as HTMLInputElement).value = '';
	};

	const canUploadFiles = $derived(!disabled && !uploading);

	$effect(() => {
		if (gpxNameLocal !== gpxFileName.value) {
			gpxFileName.value = gpxNameLocal;
		}
	});
</script>

{#if file.value === undefined}
	<div
		transition:slide
		role="button"
		class="focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-lg"
		tabindex="0"
		onkeydown={(e) => {
			if ((e.key === 'Enter' || e.key === ' ') && canUploadFiles) {
				e.preventDefault();
				document.getElementById('fileUpload')?.click();
			}
		}}
	>
		<label
			ondragover={(e) => e.preventDefault()}
			ondrop={drop}
			for="fileUpload"
			aria-disabled={!canUploadFiles}
			class="border-border border-3 border-dashed hover:bg-accent/80 flex w-full place-items-center justify-center rounded-lg p-6 transition-all hover:cursor-pointer aria-disabled:opacity-50 aria-disabled:hover:cursor-not-allowed"
		>
			<div class="flex flex-col place-items-center justify-center gap-4">
				<div
					transition:fade
					class="border-border text-muted-foreground flex size-14 place-items-center justify-center rounded-full border"
				>
					<UploadIcon class="size-7" />
				</div>

				<div class="flex flex-col gap-0.5 text-center">
					<span class="text-muted-foreground font-medium">
						{m.dragAndDrop()}
					</span>
				</div>
			</div>
			<input
				disabled={!canUploadFiles}
				id="fileUpload"
				accept=".gpx"
				type="file"
				onchange={change}
				class="hidden"
				aria-busy="true"
			/>
		</label>
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
					file.value = undefined;
					tracks.value = undefined;
					tracksBuffers.value = undefined;
					bufferSize.reset();
					trackBBoxMinLength.value = undefined;
					overpassPolygons.value = undefined;
					waterSources.value = undefined;
					selectedWaterSources.setSelectedWaterSources(undefined);
					uploading = false;
				}}
			>
				<XIcon />
			</Button>
		</Card.Content>
	</Card.Root>
{/if}
