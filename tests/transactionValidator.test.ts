import { describe, test, expect } from "vitest";
import { validateTransaction } from "../src/validation/transactionValidator.js";
import log4js from "log4js";

const logger = log4js.getLogger();

describe("validateTransaction", () => {
    test("returns valid transaction when all fields are correct", () => {
        const result = validateTransaction(
            "Alice",
            "Bob",
            10,
            "Lunch",
            new Date("2020-01-01"),
            logger,
            {}
        );

        expect(result).toEqual({
            from: "alice",
            to: "bob",
            amount: 10,
            narrative: "Lunch",
            date: new Date("2020-01-01"),
        });
    });

    test("returns undefined when from is empty", () => {
        const result = validateTransaction(
            "",
            "bob",
            10,
            "Lunch",
            new Date("2020-01-01"),
            logger,
            {}
        );

        expect(result).toBeUndefined();
    });
    test("returns undefined when to is empty", () => {
        const result = validateTransaction(
            "Alice",
            "",
            10,
            "Lunch",
            new Date("2020-01-01"),
            logger,
            {}
        );

        expect(result).toBeUndefined();
    });

    test("returns undefined when amount is zero", () => {
        const result = validateTransaction(
            "Alice",
            "Bob",
            0,
            "Lunch",
            new Date("2020-01-01"),
            logger,
            {}
        );

        expect(result).toBeUndefined();
    });

    test("returns undefined when amount is negative", () => {
        const result = validateTransaction(
            "Alice",
            "Bob",
            -5,
            "Lunch",
            new Date("2020-01-01"),
            logger,
            {}
        );

        expect(result).toBeUndefined();
    });
    test("returns undefined when amount is Nan", () => {
        const result = validateTransaction(
            "Alice",
            "Bob",
            NaN,
            "Lunch",
            new Date("2020-01-01"),
            logger,
            {}
        );

        expect(result).toBeUndefined();
    });

    test("returns undefined when date is invalid", () => {
        const result = validateTransaction(
            "Alice",
            "Bob",
            10,
            "Lunch",
            new Date("invalid"),
            logger,
            {}
        );

        expect(result).toBeUndefined();
    });
    test("returns undefined when narrative is empty", () => {
        const result = validateTransaction(
            "Alice",
            "Bob",
            10,
            "",
            new Date("2020-01-01"),
            logger,
            {}
        );

        expect(result).toBeUndefined();
    });
});