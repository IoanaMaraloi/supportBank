import type { Transaction } from "./Transaction.js";
export class Person {
    name: string;
    amount: number;
    transactions: Transaction[];

    constructor(name: string) {
        this.name = name;
        this.amount = 0;
        this.transactions = [];
    }
    addTransaction(transaction: Transaction) {
        this.transactions.push(transaction);
        this.amount += transaction.amount;
    }
    toString(): string {
        return `${this.name}: ${this.amount.toFixed(2)}`;
    }
}
