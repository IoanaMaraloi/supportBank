import { Person } from "./models/Person.js";
import { Transaction } from "./models/Transaction.js";
import type { ValidTransactionData } from "./validation/transactionValidator.js";
import { basename, join } from "node:path";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { format } from "date-fns";

export class Bank {
    people = new Map<string, Person>();

    processTransaction(transaction: ValidTransactionData): void {
        let sender = this.people.get(transaction.from);

        if (!sender) {
            sender = new Person(transaction.from);
            this.people.set(transaction.from, sender);
        }

        let recipient = this.people.get(transaction.to);

        if (!recipient) {
            recipient = new Person(transaction.to);
            this.people.set(transaction.to, recipient);
        }

        sender.addTransaction(
            new Transaction(
                -transaction.amount,
                recipient,
                transaction.date,
                transaction.narrative
            )
        );

        recipient.addTransaction(
            new Transaction(
                transaction.amount,
                sender,
                transaction.date,
                transaction.narrative
            )
        );
    }
    listAll(): void {
        this.people.forEach((person) => {
            console.log(person.toString());
        });
    }
    listAccount(accountName: string): void {
        const account = this.people.get(accountName);
        if (!account) {
            console.log("Account not found");
        } else {
            console.log(account.toString());
            account.transactions.forEach((transaction) => {
                console.log(transaction.toString());
            });
        }
    }
    exportTransactions(file: string): void {
        const exportDir = "exports";
        const fileName = basename(file);
        const outputPath = join(exportDir, fileName);

        mkdirSync(exportDir, { recursive: true });

        if (existsSync(outputPath)) {
            console.log(`File ${outputPath} already exists.`);
            return;
        }
        let transactionList: ValidTransactionData[] = [];
        this.people.forEach((person) => {
            person.transactions.forEach((transaction) => {
                if (transaction.amount > 0) {
                    transactionList.push({
                        from: transaction.otherPerson.name,
                        to: person.name,
                        amount: transaction.amount,
                        narrative: transaction.narrative,
                        date: transaction.date,
                    });
                }
            });
        });
        if (file.endsWith(".json")) {
            const jsonOutput = JSON.stringify(transactionList);
            writeFileSync(outputPath, jsonOutput);
            console.log(
                `Exported ${transactionList.length} transactions to ${outputPath}`
            );
        } else if (file.endsWith(".csv")) {
            let csvOutput = "Date,From,To,Narrative,Amount";
            transactionList.forEach((transaction) => {
                const date = format(transaction.date, "dd/MM/yyyy");
                csvOutput += `\n${date},${transaction.from},${transaction.to},${transaction.narrative},${transaction.amount}`;
            });
            writeFileSync(outputPath, csvOutput);
            console.log(
                `Exported ${transactionList.length} transactions to ${outputPath}`
            );
        } else {
            console.log("Unsupported file format");
        }
    }
}
