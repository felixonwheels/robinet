<script lang="ts">
	import BufferSlider from '$lib/components/BufferSlider.svelte';
	import ExportButton from '$lib/components/ExportButton.svelte';
	import FileDrop from '$lib/components/FileDrop.svelte';
	import Map from '$lib/components/Map.svelte';
	import Title from '$lib/components/Title.svelte';
</script>

<div class="space-y-4">
	<Title />
	<FileDrop />
	<Map />
	<BufferSlider />
	<ExportButton />
</div>
