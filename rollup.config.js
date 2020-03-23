import path from 'path'

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import strip from '@rollup/plugin-strip'

import removeExport from './workbench/rollup-plugins/remove-export'
import overwrite from './workbench/rollup-plugins/overwrite'

import generatePages from './workbench/rollup/generatePages'

const DEV = process.env.NODE_ENV === 'development'

const output = (filepath = 'index.js') => path.resolve(__dirname, 'build', filepath)
const onDev = (exec) => DEV ? (exec() || []) : []
const onProd = (exec) => !DEV ? (exec() || []) : []

const babelConfig = {
	babelrc: false,
	presets: [
		['@babel/preset-react', {
			pragma: 'h',
		}],
		...onProd(() => [
			['minify', {
				mangle: false,
			}]
		]),
	],
	plugins: [
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-export-namespace-from',
	],
}

export default [
	{
		input: 'src/client.js',
		output: [
			{
				file: output('assets/app.js'),
				format: 'iife',
				sourcemap: true,
			},
		],
		plugins: [
			overwrite({
				'src/app/pages.js': generatePages('src/app/pages', 'src/app/'),
			}),
			...onProd(() => [
				removeExport({
					dir: 'src/app/pages',
					functions: [
						[
							'fetchRemoteState',
							(node) => ('export const fetchRemoteState = true' + '\n'.repeat(node.loc.end.line - node.loc.start.line)),
						],
						[
							'listPages',
							(node) => ('\n'.repeat(1 + node.loc.end.line - node.loc.start.line)),
						],
					],
					babelConfig: {
						...babelConfig,
						presets: [
							['@babel/preset-react', {
								pragma: 'h',
							}],
						],
					},
				}),
			]),
			replace({
				// Always production for React, Preact, etc.
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
			...onProd(() => [
				strip({
					functions: [
						'console.*',
					]
				}),
			]),
			commonjs(),
	    resolve({
				extensions: [
					'.js', '.mjs', '.json', '.node', '.jsx',
				],
			}),
			babel(babelConfig),
		],
	},
]
