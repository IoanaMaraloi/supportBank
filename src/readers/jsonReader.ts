import { Bank } from "../bank.js";
import { readFileSync } from "node:fs";
import { validateTransaction } from "../validation/transactionValidator.js";
import log4js from "log4js";
import type {JsonTransaction} from "../types/jsonTransaction.js";
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
    let entries: JsonTransaction[];
    try {
        entries = JSON.parse(data) as JsonTransaction[];
    } catch (error) {
        logger.error("Could not parse JSON file", fileName);
        return;
    }
    for (const entry of entries) {
        const transaction = validateTransaction(
            entry.FromAccount,
            entry.ToAccount,
            entry.Amount,
            entry.Narrative,
            new Date(entry.Date),
            logger,
            entry
        );

        if (!transaction) {
            continue;
        }

        bank.processTransaction(transaction);
    }
    console.log(`File ${fileName} successfully read!`);
}
