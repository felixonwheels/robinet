import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { adapter: adapter({ pages: 'build' }) },
	extensions: ['.svelte', '.svx']
};

export default config;
