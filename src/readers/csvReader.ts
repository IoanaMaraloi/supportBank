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
        const to = row["To"];
        const from = row["From"];
        const amount = Number(row["Amount"]);
        const narrative = row["Narrative"];
        const date = parseDate(row["Date"]!, "dd/MM/yyyy", new Date());
        const transaction = validateTransaction(
            from,
            to,
            amount,
            narrative,
            date,
            logger,
            row
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
