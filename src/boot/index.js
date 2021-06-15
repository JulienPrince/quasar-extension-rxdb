import prompts from '../../../../../quasar.extensions.json'
export default async ({ app }) => {
  app.provide('propmts', prompts)
}
