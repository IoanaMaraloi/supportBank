import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { Bank } from "../src/bank.js";
import { readXmlFile } from "../src/readers/xmlReader.js";
import log4js from "log4js";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const logger = log4js.getLogger();

describe("readXmlFile", () => {
    const testDir = "tmp-xml";
    const testFile = join(testDir, "test.xml");

    beforeAll(() => {
        mkdirSync(testDir, { recursive: true });
        writeFileSync(
            testFile,
            `<?xml version="1.0"?>
            <TransactionList><SupportTransaction Date="43831"><Description>Lunch</Description><Value>10</Value><Parties><From>Alice</From><To>Bob</To></Parties></SupportTransaction></TransactionList>`
        );
    });

    afterAll(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    it("reads a valid XML file and processes transactions", () => {
        const bank = new Bank();
        readXmlFile(testFile, bank, logger);

        expect(bank.people.get("alice")?.amount).toBe(-10);
        expect(bank.people.get("bob")?.amount).toBe(10);
    });

    it("logs an error when the file does not exist", () => {
        const bank = new Bank();
        const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});

        readXmlFile("nonexistent.xml", bank, logger);

        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
