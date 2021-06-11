import { boot } from "quasar/wrappers"
import prompts from "quasar.extensions.json"

export default boot(({ app, router }) => {
  app.provide('propmts', prompts)
})
