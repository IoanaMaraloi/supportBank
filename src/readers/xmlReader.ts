import type { Bank } from "../bank.js";
import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "node:fs";
import { validateTransaction } from "../validation/transactionValidator.js";
import log4js from "log4js";

interface XmlTransaction {
    Description: string;
    Value: number;
    Parties: {
        From: string;
        To: string;
    };
    "@_Date": string;
}

function convertExcelDate(dateNumber: number): Date {
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const excelStartDate = Date.UTC(1899, 11, 30);
    return new Date(excelStartDate + dateNumber * millisecondsInOneDay);
}
export function readXmlFile(
    fileName: string,
    bank: Bank,
    logger: log4js.Logger
): void {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    let data: string;
    try {
        data = readFileSync(fileName, "utf-8");
    } catch (error) {
        logger.error("Could not read file", fileName);
        return;
    }
    const xml = parser.parse(data) as { TransactionList: { SupportTransaction: XmlTransaction[] } };
    const rawEntries = xml.TransactionList.SupportTransaction;
    const entries = Array.isArray(rawEntries) ? rawEntries : [rawEntries];
    for (const entry of entries) {
        const from = entry.Parties.From;
        const to = entry.Parties.To;
        const amount = Number(entry.Value);
        const narrative = entry.Description;
        const dateNumber = Number(entry["@_Date"]);
        const date = convertExcelDate(dateNumber);
        const transaction = validateTransaction(
            from,
            to,
            amount,
            narrative,
            date,
            logger,
            entry
        );

        if (!transaction) {
            continue;
        }

        bank.processTransaction(
            transaction.from,
            transaction.to,
            transaction.amount,
            transaction.narrative,
            transaction.date
        );
    }
}
