# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

const formFields = [
{
key: 'name',
label: 'Name',
type: 'text',
required: true
},
{
key: 'status',
label: 'Active',
type: 'switch',
defaultValue: true
},
{
key: 'country',
label: 'Country',
type: 'select',
options: [
{ label: 'United States', value: 'us' },
{ label: 'Saudi Arabia', value: 'sa' }
],
required: true
}
]
