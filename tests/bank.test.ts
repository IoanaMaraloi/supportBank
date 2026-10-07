import { describe, it, expect } from "vitest";
import { Bank } from "../src/bank.js";

describe("Bank", () => {
    it("creates sender and receiver accounts", () => {
        const bank = new Bank();
        bank.processTransaction(
            "Alice",
            "Bob",
            10,
            "Lunch",
            new Date("2020-01-01")
        );

        expect(bank.people.has("Alice")).toBe(true);
        expect(bank.people.has("Bob")).toBe(true);
    });

    it("updates balances correctly", () => {
        const bank = new Bank();
        bank.processTransaction(
            "Alice",
            "Bob",
            10,
            "Lunch",
            new Date("2020-01-01")
        );

        expect(bank.people.get("Alice")?.amount).toBe(-10);
        expect(bank.people.get("Bob")?.amount).toBe(10);
    });

    it("records one transaction for each person", () => {
        const bank = new Bank();
        bank.processTransaction(
            "Alice",
            "Bob",
            10,
            "Lunch",
            new Date("2020-01-01")
        );

        expect(bank.people.get("Alice")?.transactions.length).toBe(1);
        expect(bank.people.get("Bob")?.transactions.length).toBe(1);
    });

    it("links each transaction to the other person", () => {
        const bank = new Bank();
        bank.processTransaction(
            "Alice",
            "Bob",
            10,
            "Lunch",
            new Date("2020-01-01")
        );

        const aliceTransaction = bank.people.get("Alice")?.transactions[0];
        const bobTransaction = bank.people.get("Bob")?.transactions[0];

        expect(aliceTransaction?.otherPerson.name).toBe("Bob");
        expect(bobTransaction?.otherPerson.name).toBe("Alice");
    });

    it("stores the narrative and date on each transaction", () => {
        const bank = new Bank();
        const date = new Date("2020-01-01");
        bank.processTransaction("Alice", "Bob", 10, "Lunch", date);

        const aliceTransaction = bank.people.get("Alice")?.transactions[0];

        expect(aliceTransaction?.narrative).toBe("Lunch");
        expect(aliceTransaction?.date).toEqual(date);
    });
});
