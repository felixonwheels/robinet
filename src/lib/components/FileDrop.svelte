<script lang="ts">
	import { UploadIcon, XIcon } from '@lucide/svelte';
	import * as gpx from 'gpx.studio/gpx/src/index';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';

	import * as Card from '$lib/components/ui/card/index.js';
	import { FileDropZone, type FileDropZoneProps } from '$lib/components/ui/file-drop-zone';
	import { m } from '$lib/paraglide/messages.js';
	import { file, waterSources } from '$lib/state.svelte';

	import Button from './ui/button/button.svelte';

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		const mainFile = uploadedFiles[0];

		const content = await mainFile.text();

		const g = gpx.parseGPX(content);

		file.setValue([g]);

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

{#if file.value === null}
	<div transition:slide>
		<FileDropZone
			{onUpload}
			{onFileRejected}
			maxFiles={1}
			accept=".gpx"
			fileCount={file.value !== null ? 1 : 0}
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
	<Card.Root>
		<Card.Content class="flex w-full place-items-center justify-between">
			<span class="text-muted-foreground font-medium overflow-auto">
				{file.value[0]?.metadata?.name ?? '-'}
			</span>
			<Button
				variant="outline"
				size="icon"
				onclick={() => {
					file.setValue(null);
					waterSources.setValue(null);
				}}
			>
				<XIcon />
			</Button>
		</Card.Content>
	</Card.Root>
{/if}
