import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { Bank } from "../src/bank.js";
import { readCsvFile } from "../src/readers/csvReader.js";
import log4js from "log4js";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const logger = log4js.getLogger();

describe("readCsvFile", () => {
    const testDir = "tmp-csv";
    const testFile = join(testDir, "test.csv");

    beforeAll(() => {
        mkdirSync(testDir, { recursive: true });
        writeFileSync(
            testFile,
            "Date,From,To,Narrative,Amount\n" +
                "01/01/2020,Alice,Bob,Lunch,10.50\n"
        );
    });

    afterAll(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    it("reads a valid CSV file and processes transactions", () => {
        const bank = new Bank();
        readCsvFile(testFile, bank, logger);

        expect(bank.people.get("alice")?.amount).toBe(-10.5);
        expect(bank.people.get("bob")?.amount).toBe(10.5);
    });

    it("logs an error when the file does not exist", () => {
        const bank = new Bank();
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});

        readCsvFile("nonexistent.csv", bank, logger);

        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
