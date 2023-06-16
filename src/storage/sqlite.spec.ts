import { expect } from "chai";
import Database, { Database as DatabaseType } from "better-sqlite3";
import SqliteStorage from "./sqlite";
import { faker } from "@faker-js/faker";
import { mock } from "node:test";
import { ethers } from "ethers";

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

const mockContractAddress = faker.finance.ethereumAddress();

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
    const subscriptions = [
      {
        address: faker.finance.ethereumAddress(),
        contract: new ethers.Contract(mockContractAddress, mockABI),
        fromBlock: 0,
        chainName: "mainnet",
      },
      {
        address: "0x0987654321098765432109876543210987654321",
        contract: new ethers.Contract(mockContractAddress, mockABI),
        fromBlock: 0,
        chainName: "gnosis",
      },
    ];

    await storage.setSubscriptions(subscriptions);
    const result = await storage.getSubscriptions();

    expect(result).to.deep.equal(subscriptions);
  });
});
