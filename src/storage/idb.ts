import { IDBPDatabase, openDB } from "idb";
import type { Storage, Subscription } from "../index";
import { ethers } from "ethers";

export default class IdbStorage implements Storage {
  /**
   * The IndexedDB database instance.
   * @type {IDBPDatabase<ChainsauceDB> | null}
   */
  db: IDBPDatabase | null = null;

  entities: string[];

  /**
   * Constructs a new IdbStorage instance with the given array of entity objects.
   * @param {string[]} entities - The array of entity objects.
   */
  constructor(entities: string[]) {
    this.entities = entities;
  }

  /**
   * Initializes the IndexedDB database with the name "chainsauce" and version 1.
   * @returns A promise that resolves to void.
   */
  async init() {
    /**
     * The IndexedDB database instance.
     * @type {IDBPDatabase<ChainsauceDB> | null}
     */
    this.db = await openDB("chainsauce", 1, {
      /**
       * The upgrade callback function that is called when the database is first created or when the version number is incremented.
       * @param {IDBPDatabase<ChainsauceDB>} db - The database instance.
       */
      upgrade: (db) => {
        /**
         * Creates an object store for subscriptions in the IndexedDB database with the name "__subscriptions" and a key path of "address".
         * An index is also created on the store with the name "by-address" and the key path "address".
         * @param {IDBPDatabase<ChainsauceDB>} db - The database instance.
         */
        const subscriptionStore = db.createObjectStore("__subscriptions", {
          keyPath: "address",
        });
        subscriptionStore.createIndex("by-address", "address");

        /**
         * Loops through each entity in the `entities` array and creates an object store for each entity in the IndexedDB database.
         * If an entity has an index, a new object store is created with the index as the key path and an index is created on the store.
         * @param {IDBPDatabase<ChainsauceDB>} db - The database instance.
         * @param {string[]} entities - The array of entity objects.
         */
        //TODO init with indexing
        for (const entity of this.entities) {
          db.createObjectStore(entity);
        }
      },
    });
  }

  /**
   * Retrieves all subscriptions from the "__subscriptions" object store in the IndexedDB database.
   * @returns A promise that resolves to an array of Subscription objects.
   * @throws An error if the database has not been initialized.
   */
  async getSubscriptions(): Promise<Subscription[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    const subs = await this.db.getAll("__subscriptions");

    return subs.map(
      (sub: {
        address: string;
        abi: string;
        fromBlock: number;
        chainName: string;
      }) => ({
        address: sub.address,
        contract: new ethers.Contract(sub.address, JSON.parse(sub.abi)),
        fromBlock: sub.fromBlock,
        chainName: sub.chainName,
      })
    );
  }

  /**
   * Retrieves all subscriptions from the "__subscriptions" object store in the IndexedDB database.
   * @returns A promise that resolves to an array of Subscription objects.
   * @throws An error if the database has not been initialized.
   */
  async setSubscriptions(subscriptions: Subscription[]): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    const tx = this.db.transaction("__subscriptions", "readwrite");
    const store = tx.objectStore("__subscriptions");

    await store.clear();
    const inserts = subscriptions.map((sub) =>
      tx.store.add({
        address: sub.address,
        abi: sub.contract.interface.format(
          ethers.utils.FormatTypes.json
        ) as string,
        fromBlock: sub.fromBlock,
        chainName: sub.chainName,
      })
    );

    await Promise.all(inserts);
    await tx.done;
  }
}
