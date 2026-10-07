import { Bank } from "../bank.js";
import { readFileSync } from "node:fs";
import { validateTransaction } from "../validation/transactionValidator.js";
import log4js from "log4js";
interface JsonEntry {
    Date: string;
    FromAccount: string;
    ToAccount: string;
    Narrative: string;
    Amount: number;
}
export function readJsonFile(
    fileName: string,
    bank: Bank,
    logger: log4js.Logger
) {
    let data: string;
    try {
        data = readFileSync(fileName, "utf-8");
    } catch (error) {
        logger.error("Could not read file", fileName);
        return;
    }
    let entries: JsonEntry[];
    try {
        entries = JSON.parse(data) as JsonEntry[];
    } catch (error) {
        logger.error("Could not parse JSON file", fileName);
        return;
    }
    for (const entry of entries) {
        const to = entry.ToAccount;
        const from = entry.FromAccount;
        const amount = entry.Amount;
        const date = new Date(entry.Date);
        const narrative = entry.Narrative;
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
