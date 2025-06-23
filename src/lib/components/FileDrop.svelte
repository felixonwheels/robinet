<script lang="ts">
	import { UploadIcon, XIcon } from '@lucide/svelte';
	import * as gpx from 'gpx.studio/gpx/src/index';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';

	import { FileDropZone, type FileDropZoneProps } from '$lib/components/ui/file-drop-zone';
	import { m } from '$lib/paraglide/messages.js';
	import { route } from '$lib/state/route.svelte';

	import Button from './ui/button/button.svelte';

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		const mainFile = uploadedFiles[0];

		const content = await mainFile.text();

		const g = gpx.parseGPX(content);

		route.setFile([g]);

		const pointCount =
			g.trk?.reduce((sum, trk) => {
				return sum + trk.trkseg?.reduce((segSum, seg) => segSum + (seg.trkpt?.length || 0), 0) || 0;
			}, 0) || 0;

		toast.success(m.filePoints({ count: pointCount }));
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(m.uploadErrorFailToUpload({ name: file.name }), { description: reason });
	};
</script>

{#if route?.file() === null}
	<div transition:slide>
		<FileDropZone
			{onUpload}
			{onFileRejected}
			maxFiles={1}
			accept=".gpx"
			fileCount={route?.file()?.length ?? 0}
		>
			<div class="flex flex-col place-items-center justify-center gap-2">
				<div
					class="border-border text-muted-foreground flex size-14 place-items-center justify-center rounded-full border border-dashed"
				>
					<UploadIcon class="size-7" />
				</div>

				<div class="flex flex-col gap-0.5 text-center">
					<span class="text-muted-foreground font-medium">
						{m.dragAndDrop()}
					</span>
					<span class="text-muted-foreground/75 text-sm">
						<span>{m.fileRestriction()}</span>
					</span>
				</div>
			</div>
		</FileDropZone>
	</div>
{:else}
	<div
		transition:slide
		class="border-border flex w-full place-items-center justify-between rounded-lg border-2 border-dashed p-4 transition-all"
	>
		<span class="text-muted-foreground font-medium overflow-auto">
			{route?.file()?.[0]?.metadata?.name ?? '-'}
		</span>
		<Button
			variant="outline"
			size="icon"
			onclick={() => {
				route?.setFile(null);
			}}
		>
			<XIcon />
		</Button>
	</div>
{/if}
