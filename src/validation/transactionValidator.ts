import type log4js from "log4js";

export interface ValidTransactionData {
    from: string;
    to: string;
    amount: number;
    narrative: string;
    date: Date;
}

export function validateTransaction(
    from: string | undefined,
    to: string | undefined,
    amount: number,
    narrative: string | undefined,
    date: Date,
    logger: log4js.Logger,
    originalEntry: any
): ValidTransactionData | undefined {
    if (!from) {
        logger.error("Invalid From account", originalEntry);
        return undefined;
    }

    if (!to) {
        logger.error("Invalid To account", originalEntry);
        return undefined;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        logger.error("Invalid amount", originalEntry);
        return undefined;
    }

    if (!narrative) {
        logger.error("Invalid narrative", originalEntry);
        return undefined;
    }

    if (Number.isNaN(date.getTime())) {
        logger.error("Invalid date", originalEntry);
        return undefined;
    }

    return {
        from: from,
        to: to,
        amount: amount,
        narrative: narrative,
        date: date,
    };
}
