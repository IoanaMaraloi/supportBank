import { describe, expect, test} from "vitest";
import { Bank } from "../src/bank.js";
import type { ValidTransactionData } from "../src/validation/transactionValidator.js";

const makeTransaction = (): ValidTransactionData => ({
    from: "alice",
    to: "bob",
    amount: 10,
    narrative: "Lunch",
    date: new Date("2020-01-01"),
});

const it = test.extend<{ bank: Bank }>({
    bank: async ({}, use) => {
        const bank = new Bank();
        bank.processTransaction(makeTransaction());
        await use(bank);
    },
});
describe("Bank", () => {
    it("creates sender and receiver accounts", ({ bank }) => {
        expect(bank.people.has("alice")).toBe(true);
        expect(bank.people.has("bob")).toBe(true);
    });

    it("updates balances correctly", ({ bank }) => {
        expect(bank.people.get("alice")?.amount).toBe(-10);
        expect(bank.people.get("bob")?.amount).toBe(10);
    });

    it("records one transaction for each person", ({ bank }) => {
        expect(bank.people.get("alice")?.transactions.length).toBe(1);
        expect(bank.people.get("bob")?.transactions.length).toBe(1);
    });

    it("links each transaction to the other person", ({ bank }) => {
        const aliceTransaction = bank.people.get("alice")?.transactions[0];
        const bobTransaction = bank.people.get("bob")?.transactions[0];

        expect(aliceTransaction?.otherPerson.name).toBe("bob");
        expect(bobTransaction?.otherPerson.name).toBe("alice");
    });

    it("stores the narrative and date on each transaction", ({ bank }) => {
        const aliceTransaction = bank.people.get("alice")?.transactions[0];

        expect(aliceTransaction?.narrative).toBe("Lunch");
        expect(aliceTransaction?.date).toEqual(makeTransaction().date);
    });
});