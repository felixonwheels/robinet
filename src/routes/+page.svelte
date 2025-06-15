<script lang="ts">
	import ExportButton from '$lib/components/ExportButton.svelte';
	import FileDrop from '$lib/components/FileDrop.svelte';
	import Map from '$lib/components/Map.svelte';
</script>

<div class="space-y-4">
	<FileDrop />
	<Map />
	<ExportButton />
</div>
