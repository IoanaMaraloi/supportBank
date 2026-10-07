import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { Bank } from "../src/bank.js";
import { readJsonFile } from "../src/readers/jsonReader.js";
import log4js from "log4js";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const logger = log4js.getLogger();

describe("readJsonFile", () => {
    const testDir = "tmp-json";
    const testFile = join(testDir, "test.json");

    beforeAll(() => {
        mkdirSync(testDir, { recursive: true });
        writeFileSync(
            testFile,
            JSON.stringify([
                {
                    Date: "2020-01-01T00:00:00",
                    FromAccount: "Alice",
                    ToAccount: "Bob",
                    Narrative: "Lunch",
                    Amount: 10,
                },
            ])
        );
    });

    afterAll(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    it("reads a valid JSON file and processes transactions", () => {
        const bank = new Bank();
        readJsonFile(testFile, bank, logger);

        expect(bank.people.get("alice")?.amount).toBe(-10);
        expect(bank.people.get("bob")?.amount).toBe(10);
    });

    it("logs an error when the file does not exist", () => {
        const bank = new Bank();
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});

        readJsonFile("nonexistent.json", bank, logger);

        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
