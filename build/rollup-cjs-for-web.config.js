import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/web-cjs/bundle.js',
		format: 'cjs',
		name: 'platformClient',
		interop: 'auto',
		intro: 'var exports = {"__esModule": true};'
	},
	plugins: [ 
		resolve(),
		commonjs({
			include: 'node_modules/**',  // Default: undefined
			browser: true,
			preferBuiltins: false,
			ignoreGlobal: false,
			sourceMap: false
		})
	],
	external: [
	]
};