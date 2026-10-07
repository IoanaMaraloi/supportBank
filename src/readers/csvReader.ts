import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { parse as parseDate } from "date-fns/parse";
import type { Bank } from "../bank.js";
import { validateTransaction } from "../validation/transactionValidator.js";
import log4js from "log4js";

export function readCsvFile(
    fileName: string,
    bank: Bank,
    logger: log4js.Logger
): void {
    let data: string;
    try {
        data = readFileSync(fileName, "utf-8");
    } catch (error) {
        logger.error("Could not read file", fileName);
        return;
    }
    const rows = parse(data, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    }) as Record<string, string>[];
    for (const row of rows) {
        const transaction = validateTransaction(
            row["From"],
            row["To"],
            Number(row["Amount"]),
            row["Narrative"],
            parseDate(row["Date"]!, "dd/MM/yyyy", new Date()),
            logger,
            row
        );

        if (!transaction) {
            continue;
        }

        bank.processTransaction(transaction);
    }
    console.log(`File ${fileName} successfully read!`);
}
