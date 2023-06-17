<h1 align="center">
<strong>Chainsauce 💃</strong>
</h1>
<p align="center">
<strong>Source EVM events into a database for easy querying</strong>
</p>

---

Fork of [Chainsauce] that's client side only using IndexedDB for caching.

Chainsauce is a general-purpose EVM indexer that sources contract events to build easily queryable data. It works in the browser.

## How does it work?

The indexer uses JSON-RPC to fetch all the events for your contracts from a node, then calls your supplied reducer function for each event, which should build the database.

## How to use?

Install the package:

```bash
$ npm install chainsauce-web
```

Example:

```ts
import ethers from "ethers";
import { createIndex, JsonStorage, Event } from "chainsauce";

import MyContractABI from "./abis/MyContract.json" assert { type: "json" };

async function handleEvent(indexer: Indexer<JsonStorage>, event: Event) {
  const db = indexer.storage;

  switch (event.name) {
    case "UserCreated":
      db.collection("users").insert({
        id: event.args.id,
        name: event.args.name,
      });
      break;

    case "UserUpdated":
      db.collection("users").updateById(event.args.id, {
        name: event.args.name,
      });
      break;
  }
}

const provider = new ethers.providers.JsonRpcProvider("http://mynode.com");
const storage = new JsonStorage("./data");
const indexer = await createIndexer(provider, storage, handleEvent);

// Susbscribe to events with the contract address and ABI
indexer.subscribe("0x1234567890", MyContractABI);
```

## Using the Entity interface with IndexedDB

The Entity interface is a common way to define domain objects in TypeScript. With IndexedDB, you can use the Entity interface to define object stores and indexes.

To use the Entity interface with IndexedDB, you can define an Entity class that represents a domain object. The Entity class should have properties that correspond to the fields of the domain object, as well as an optional index property that defines an index on the object store.

Here's an example of an Entity class for a User object:

```js
interface User {
  id: number;
  name: string;
}

const userEntity: Entity<User> = {
  name: "users",
  index: {
    name: "name",
    keyPath: "name",
  },
};
```

In this example, the User interface defines the id and name properties of a user object. The userEntity object defines an object store for User objects with the name "users", and an index on the "name" property.

## Complete examples

- [Cookie Jar](http://github.com/bitbeckers/cookie-jar)

## Why event sourcing? 🤔

- The database can be rebuilt any time only from the logs
- Reuse the exact same codebase to build queryable databases for any chain
- Easily testable, it's just a single function ✨
- Super fast database rebuilds with cached events ⚡️

## Persistence options

- **IndexedDB**: Store the full state client side in the browser.
- **SQLite**: This is a great alternative if you still don't want the complexity of a server database. It will give you all the niceties of SQL and you'll be able to serve the database over IPFS for people to use. Query from the front end using: [sql.js with an HTTP VFS](https://github.com/phiresky/sql.js-httpvfs)

## Limitations

- Because the indexer uses JSON-RPC to fetch logs, it relies on the provider's ability to filter and return blockchain events, some providers limit the amount of events that can be returned in one call. The indexer gets around this by fetching smaller block ranges. It's best to use your own node if you encounter issues, but **for most people it should be fine**.
- Slow to start. For every user the complete history is indexed. In the future, application could be served with an initial state.
