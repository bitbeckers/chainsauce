import { expect } from "chai";
import Database, { Database as DatabaseType } from "better-sqlite3";
import SqliteStorage from "./sqlite";
import { faker } from "@faker-js/faker";
import { ethers } from "ethers";
import { pick } from "lodash";

const mockABI = JSON.stringify([
  {
    inputs: [],
    name: "getCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]);

describe("SqliteStorage", () => {
  let db: DatabaseType;
  let storage: SqliteStorage;

  beforeAll(() => {
    db = new Database(":memory:");
    storage = new SqliteStorage(db);
  });

  beforeEach(async () => {
    await storage.init();
  });

  afterEach(() => {
    db.prepare("DELETE FROM __subscriptions").run();
  });

  afterAll(() => {
    db.close();
  });

  it("should be able to get and set subscriptions", async () => {
    const subs = Array.from({ length: 2 }).map(() => {
      const address = faker.finance.ethereumAddress();
      return {
        address,
        contract: new ethers.Contract(address, mockABI),
        fromBlock: 0,
        chainName: "mainnet",
      };
    });

    await storage.setSubscriptions(subs);
    const result = await storage.getSubscriptions();

    // Use the `pick` function to extract only the relevant properties
    const subsWithoutContracts = subs.map((sub) =>
      pick(sub, ["address", "fromBlock", "chainName"])
    );
    const resultWithoutContracts = result.map((sub) =>
      pick(sub, ["address", "fromBlock", "chainName"])
    );

    expect(resultWithoutContracts).to.deep.equal(subsWithoutContracts);
  });
});
