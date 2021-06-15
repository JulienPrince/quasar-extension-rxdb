import { createRxDatabase, addRxPlugin } from "rxdb";

import { SubscriptionClient } from "subscriptions-transport-ws";

import { RxDBValidatePlugin } from "rxdb/plugins/validate";
import * as PouchdbAdapterIdb from "pouchdb-adapter-idb";
import { RxDBReplicationPlugin } from "rxdb/plugins/replication";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { RxDBReplicationGraphQLPlugin } from "rxdb/plugins/replication-graphql";

import { setupQuery, subscribe } from "./utils";
import { useStore } from "vuex";
import { inject } from 'vue';

//plugins used By RxDb
addRxPlugin(RxDBReplicationGraphQLPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBValidatePlugin);
addRxPlugin(RxDBReplicationPlugin);
addRxPlugin(PouchdbAdapterIdb);
addRxPlugin(RxDBUpdatePlugin);

let localDB = null;
let collections = [];
let replicationStates = [];
let wsClient = null;
let collectionsName = [];

let queryBuilders = null;
let schema = null;

export default function rxdb() {
  const prompts = inject('propmts');
  const store = useStore();

  function initRxdb(querys, collectionSchema) {
    queryBuilders = querys;
    schema = collectionSchema;
  }

  async function createDb() {
    const { "@jdao/rxdb": { vuex_getters_db_name }} = prompts;
    const name  = store.getters[vuex_getters_db_name];
    if (name !== undefined) {
      console.log("DatabaseService: creating database..");
      const dataBase = await createRxDatabase({
        name: `sw_${name}`,
        adapter: "idb",
        ignoreDuplicate: true,
      });
      console.log("DatabaseService: created database");
      // Add name and create collection
      Object.entries(schema).map(async ([key, value]) => {
        const obj = {};
        obj[key] = {
          schema: value,
        };
        collectionsName.push(key);
        collections.push(await dataBase.addCollections(obj));
      });
      localDB = dataBase;
      return dataBase;
    } else {
      throw "database must have a name";
    }
  }

  function getDB() {
    if (localDB !== null) {
      return localDB;
    } else {
      throw "Database doesn't exist";
    }
  }

  function getCollection(name) {
    if (name !== undefined) {
      let collection = null;
      collections.findIndex((coll, index) => {
        for (let [key, value] of Object.entries(coll)) {
          if (key === name) {
            collection = value;
          }
        }
      });
      if (name !== null) {
        return collection;
      } else {
        throw `collection "${name}" doesn't exist `;
      }
    }
  }

  function initReplication() {
    if (!replicationStates.length) {
      const { "@jdao/rxdb": { server_graphql_base_url_subscription, server_graphql_base_url, vuex_getters_token }} = prompts;
      const token = store.getters[vuex_getters_token];

      const batchSize = 5;
      wsClient = new SubscriptionClient(server_graphql_base_url_subscription, {
        reconnect: true,
        connectionParams: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        connectionCallback: () => {
          console.log("SubscriptionClient.connectionCallback:");
        },
      });
      collectionsName.map(async (name) => {
        const collection = getCollection(name);
        const { subQuery, pullQueryBuilder, pushQueryBuilder } = setupQuery(
          queryBuilders,
          name,
        );

        if (collection) {
          const replicationState = await collection.syncGraphQL({
            url: server_graphql_base_url,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            pull: {
              batchSize,
              queryBuilder: pullQueryBuilder,
            },
            push: {
              batchSize,
              queryBuilder: pushQueryBuilder,
            },
            live: true,
            liveInterval: 1000 * 60 * 60,
            deletedFlag: "deleted",
          });
          replicationStates.push(replicationState);
          subscribe(replicationState, subQuery, wsClient);
        } else {
          throw "error replication verify your name of collection";
        }
      });
    }
  }

  function stopReplication() {
    if (replicationStates.length && wsClient !== null) {
      replicationStates.map((replication) => {
        replication.cancel();
      });
      wsClient.close();
      collectionsName = [];
      replicationStates = [];
      wsClient = null;
      localDB = null;
    } else {
      throw "No replication state";
    }
  }

  return {
    createDb,
    getDB,
    getCollection,
    initReplication,
    stopReplication,
    initRxdb,
  };
}
