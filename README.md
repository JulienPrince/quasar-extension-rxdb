# Quasar App Extension app-extention-rxdb

Extension Quasar pour une réplication avec GraphQl de [RxDB](https://rxdb.info/replication-graphql.html), basée sur la Composition API et vue 3.

# Installation:

Quasar CLI le récupérera de NPM et installera l'extension.

```bash:
quasar ext add @jdao/rxdb
```

# Désinstallation:

```bash
quasar ext remove @jdao/rxdb
```

# Prérequises

- Vuex 4.0: pour la gestion de token et le nom de la base donnée
- i18n: Pour localiser les notifications des erreurs
<!-- (à preciser les differants variable pour chaque erreurs) -->

## Prompts:

- urlServer: URl du server GraphQl.
- urlWebsocket: URl pour le Subscription Methode du server GraphQl.
- vuex_getters_token: getters pour l'entête Authorization
- vuex_getters_db_name: getters pour le nom de la base de donnée
  **Nb:** L'option **namespaced** est definie en **true**,
  format input dans le propmts:

```bash
vuex_getters_token: rxdb/getToken => équivalent: getters["rxdb/getToken"]
vuex_getters_db_name: rxdb/getDbame => équivalent: getters["rxdb/getDbame"]
```

#### exemple d'utilisation:

```js
//Dans store file
const state = {
  user: {
    token: your token,
    name: nameOfBase
  }
}
//getters
const getters = {
  getToken: (state) => state.user.token,
  getDbame: (state) => state.user.name
}
```

# Fonctionnalités

## initRxdb()

Initialise les variables utiles pour le bon functionement du plugin dont les suivantes:
Pour le "pull-replication", on a d'abord besoin d'un fichier pullQueryBuilder. Il s'agit d'une fonction qui obtient le dernier document répliqué en entrée et renvoie un objet avec une requête GraphQL et ses variables.

- querys : C'est un tableau qui regroupe ses queryBuilders.
- schema: Les schemas définissent à quoi ressemblent vos données, mais on droit respecter cette format:

```js
const schema = {
  nameOfCollection: {
    title: "Collection Name od schema",
    version: 0,
    description: "describes your collection",
    type: "object",
    properties: {}
  }
```

#### Exemple d'utilisation

Initialisation des paramètres dans le boot file de quasar.

```js
// boot.js
import rxdb from "@jdao/rxdb"
import schema from "../schemaRxdb" // importation du schema de RxDB
import { todoPullQueryBuilder } from "./todoQueryBuilder " //importation du fichier pullQueryBuilder
import subscriptionTodoQuery from "./subTodoQuery" //Importaion de Query pour la subscription

export default async () => {
  const { initRxdb } = rxdb()
  //init queryBuilders
  let querys = []
  querys["todos"] = [
    { pull: todoPullQueryBuilder },
    { push: todoPushQueryBuilder },
    { sub: subscriptionTodoQuery }
  ]
  initRxdb(querys, schema)
}
```

## createDb()

Méthode asyncrone pour créer la base de donnée local d'RxDB.
La methode **createDb()** est appeler de preferance qu'après une authetification et après que le token et le variable qui servira pour le nom de la base de donnée soit remplie dans le store.

#### Exemple d'utilisation:

```js
//page Login.vue
import rxdb from "@jdao/rxdb"
export default defineComponent({
 name: "Login",
 setup() {
   const { createDb } = rxdb()

   const onSubmit = async () => {
     ...Votre methode connexion valider
     .then( async function () {
       // creation de la base de donnée
       await createDb()
     })
   }
   return {

   }
 }
```

## getDB()

Une méthode pour récupérer l'instance de la base de données créer pour le manipuler plus tard, comme par exemple récupérer une collection ou autre action avec la base de donnée, plus de detail sur [RxDb](https://rxdb.info/rx-database.html#functions)

#### Exemple d'utilisation:

```js
//page todo.vue
import rxdb from "@jdao/rxdb"
export default defineComponent({
 name: "todo",
 setup() {
   const { getDB } = rxdb()
   const collection = getDB.yourColectionName

   return {
     collection
   }
 }
```

## getCollection()

Méthode qui retourne directement une collection sans passer par la méthode getDb(), il prend comme paramètre le nom de la collection (en type String).

#### exemple d'utilisation:

```js
import rxdb from "@jdao/rxdb"
export default defineComponent({
  name: "todo",
  setup() {
    const { getCollection } = rxdb()
    const collection = getCollection("todo")

    return {
      collection
    }
  }
```

## initReplication()

Méthode pour initier la réplication GraphQl de RxDb.
De préférence à utiliser dans le plus haut parent de composant après la création de la base de donnéer.

#### Exemple d'utilisation:

```js
import rxdb from "@jdao/rxdb"
export default defineComponent({
  name: "todo",
  setup() {
    const { initReplication } = rxdb()
    onMounted(()=> {
      initReplication()
    })

    return {
    }
  }
```

## stopReplication()

Méthode pour stoper tous les réplications en cours.

#### Exemple d'utilisation:

```js
import rxdb from "@jdao/rxdb"
export default defineComponent({
  name: "todo",
  setup() {
    const { stopReplication } = rxdb()

     function logout () {
       stopReplication()
     }

    return {
      logout
    }
  }
```

# Donate

Si vous appréciez le travail qui a été réalisé pour cette extension d'application, pensez à donnée une start.

# License

MIT (c) Prince <prince.julienh@gmail.com>
