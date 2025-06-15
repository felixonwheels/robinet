<script lang="ts">
	import { toast } from 'svelte-sonner';

	import {
		FileDropZone,
		type FileDropZoneProps,
		MEGABYTE,
		displaySize
	} from '$lib/components/ui/file-drop-zone';

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		console.log(uploadedFiles);
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(`${file.name} failed to upload!`, { description: reason });
	};
</script>

<FileDropZone
	{onUpload}
	{onFileRejected}
	maxFileSize={100 * MEGABYTE}
	accept="application/gpx+xml"
/>
