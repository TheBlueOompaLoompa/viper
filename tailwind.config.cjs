module.exports = {
	purge: {
		enabled: true,
		content: ['./src/**/*.svelte', './static/global.css']
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
