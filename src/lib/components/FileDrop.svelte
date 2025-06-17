<script lang="ts">
	import { LucideGitCommitHorizontal, UploadIcon, XIcon } from '@lucide/svelte';
	import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
	import * as gpx from 'gpx.studio/gpx/src/index';
	import { toast } from 'svelte-sonner';
	import { fade, slide } from 'svelte/transition';

	import {
		FileDropZone,
		type FileDropZoneProps,
		MEGABYTE,
		displaySize
	} from '$lib/components/ui/file-drop-zone';

	import Button from './ui/button/button.svelte';

	let file = $state<gpx.GPXFile[] | null>(null);

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		const mainFile = uploadedFiles[0];

		const content = await mainFile.text();

		const g = gpx.parseGPX(content);

		file = [g];

		const pointCount =
			g.trk?.reduce((sum, trk) => {
				return sum + trk.trkseg?.reduce((segSum, seg) => segSum + (seg.trkpt?.length || 0), 0) || 0;
			}, 0) || 0;

		toast.success(`file contains ${pointCount} points`);
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(`${file.name} failed to upload!`, { description: reason });
	};
</script>

<FileDropZone
	{onUpload}
	{onFileRejected}
	maxFiles={1}
	accept="application/gpx+xml"
	fileCount={file?.length ?? 0}
>
	<div class="flex flex-col place-items-center justify-center gap-2">
		<div
			class="border-border text-muted-foreground flex size-14 place-items-center justify-center rounded-full border border-dashed"
		>
			<UploadIcon class="size-7" />
		</div>

		<div class="flex flex-col gap-0.5 text-center">
			<span class="text-muted-foreground font-medium">
				Drag 'n' drop your GPX file here, or click to select it
			</span>
			<span class="text-muted-foreground/75 text-sm">
				<span>You can upload only one file</span>
			</span>
		</div>
	</div>
</FileDropZone>

{#if file !== null}
	<div transition:slide class="flex place-items-center justify-between gap-2 text-center">
		<span class="text-muted-foreground font-medium overflow-auto">
			{file[0].metadata.name}
		</span>
		<Button
			variant="outline"
			size="icon"
			onclick={() => {
				file = null;
			}}
		>
			<XIcon />
		</Button>
	</div>
{/if}
