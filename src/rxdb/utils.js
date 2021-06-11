import { Notify } from 'quasar'

export const setupQuery = (queryBuilders, collectionName) => {
  let pullQueryBuilder = null;
  let pushQueryBuilder = null;
  let subQuery = null;
  queryBuilders[collectionName].findIndex((coll, index) => {
    for (let [key, value] of Object.entries(coll)) {
      if (key === "pull") {
        pullQueryBuilder = value;
      }
      if (key === "push") {
        pushQueryBuilder = value;
      }
      if (key == "sub") {
        subQuery = value;
      }
    }
  });
  return { pullQueryBuilder, pushQueryBuilder, subQuery };
};

export const subscribe = (replicationState, query, wsClient) => {
  let changeObservable = wsClient.request({ query });
  changeObservable.subscribe({
    next(data) {
      console.log("subscription emitted => trigger run");
      replicationState.run();
    },
    error(error) {
      throw error;
    },
  });
  // Error log
  replicationState.error$.subscribe((err) => {
    Notify.create({
      message: 'Mode hors ligne',
      position: 'top',
      icon: 'warning' ,
      type: 'warning',
      textColor:'white',
      badgeStyle: 'display:none',
    })
    throw err;
  });
};
