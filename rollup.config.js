import path from 'path'

import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import json from '@rollup/plugin-json'

const output = (filepath = 'index.js') => path.resolve(__dirname, 'build', filepath)

export default [
	{
		input: 'web.js',
		output: [
			{
				file: output('assets/app.js'),
				format: 'iife',
			},
		],
		plugins: [
			babel(),
			commonjs(),
			json(),
			replace({
	      // Always production for React and ReactDOM packages
	      'process.env.NODE_ENV': JSON.stringify('production'),
	    }),
	    resolve(),
		],
	},
];
