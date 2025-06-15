<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	function delay(milliseconds: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	}

	async function work() {
		await delay(1000);
	}
</script>

<Button onClickPromise={work}>Save</Button>
