import type { Person } from "./Person.js";
export class Transaction {
    amount: number;
    otherPerson: Person;
    date: Date;
    narrative: string;
    constructor(
        amount: number,
        otherPerson: Person,
        date: Date,
        narrative: string
    ) {
        this.amount = amount;
        this.otherPerson = otherPerson;
        this.date = date;
        this.narrative = narrative;
    }
    toString(): string {
        const direction = this.amount >= 0 ? "from" : "to";
        return `${this.date.toLocaleDateString("en-GB")} ${direction} ${
            this.otherPerson.name
        }: ${Math.abs(this.amount).toFixed(2)}: ${this.narrative}`;
    }
}
