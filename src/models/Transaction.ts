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
}
