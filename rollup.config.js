import path from 'path'

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import json from '@rollup/plugin-json'
import strip from '@rollup/plugin-strip'
import removeExport from './workbench/rollup/remove-export'

const DEV = process.env.NODE_ENV === 'development'

const output = (filepath = 'index.js') => path.resolve(__dirname, 'build', filepath)
const onDev = (...values) => DEV ? values : []
const onProd = (...values) => !DEV ? values : []

const babelConfig = {
	babelrc: false,
	presets: [
		['@babel/preset-react', {
			pragma: 'h',
		}],
		...onProd(['minify', {
			mangle: false,
		}]),
	],
	plugins: [
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-export-namespace-from',
	],
}

export default [
	{
		input: 'src/web.js',
		output: [
			{
				file: output('assets/app.js'),
				format: 'iife',
				sourcemap: true,
			},
		],
		plugins: [
			removeExport({
				dir: 'src/app/pages',
				functions: ['fetchRemoteState'],
				babelConfig,
			}),
			babel(babelConfig),
			commonjs(),
			json(),
			replace({
	      // Always production for React and ReactDOM packages
	      'process.env.NODE_ENV': JSON.stringify('production'),
	    }),
			...onProd(strip({
				functions: [
					'console.*',
				]
			})),
	    resolve(),
		],
	},
];
