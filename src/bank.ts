import { Person } from "./models/Person.js";
import { Transaction } from "./models/Transaction.js";

export class Bank {
    people = new Map<string, Person>();

    processTransaction(
        from: string,
        to: string,
        amount: number,
        narrative: string,
        date: Date
    ): void {
        let sender = this.people.get(from);

        if (!sender) {
            sender = new Person(from);
            this.people.set(from, sender);
        }

        let recipient = this.people.get(to);

        if (!recipient) {
            recipient = new Person(to);
            this.people.set(to, recipient);
        }

        sender.addTransaction(
            new Transaction(-amount, recipient, date, narrative)
        );

        recipient.addTransaction(
            new Transaction(amount, sender, date, narrative)
        );
    }
    listAll(): void {
        this.people.forEach((person) => {
            console.log(person.name, person.amount);
        });
    }
    listAccount(accountName: string): void {
        const account = this.people.get(accountName);
        if (!account) {
            console.log("Account not found");
        } else {
            console.log(account.name, account.amount);
            account.transactions.forEach((transaction) => {
                console.log(
                    transaction.date.toDateString(),
                    ": ",
                    transaction.otherPerson.name,
                    transaction.amount,
                    transaction.narrative
                );
            });
        }
    }
}
