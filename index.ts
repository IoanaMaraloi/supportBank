import readlineSync from "readline-sync";
import log4js from "log4js";
import { Bank } from "./src/bank.js";
import { readCsvFile } from "./src/readers/csvReader.js";
import { readJsonFile } from "./src/readers/jsonReader.js";
import { readXmlFile } from "./src/readers/xmlReader.js";
log4js.configure({
    appenders: { file: { type: "fileSync", filename: "logs/debug.log" } },
    categories: { default: { appenders: ["file"], level: "debug" } },
});

const logger = log4js.getLogger();
logger.level = "debug";
function readFile(file: string): void {
    if (file.endsWith(".csv")) {
        readCsvFile(file, bank, logger);
    } else if (file.endsWith(".json")) {
        readJsonFile(file, bank, logger);
    } else if (file.endsWith(".xml")) {
        readXmlFile(file, bank, logger);
    } else {
        console.log(`unsupported file format: ${file}`);
    }
}
const bank = new Bank();
const files = [
    "src/transactions/Transactions2014.csv",
    "src/transactions/DodgyTransactions2015.csv",
    "src/transactions/Transactions2013.json",
    "src/transactions/Transactions2012.xml",
];

files.forEach((file) => {
    readFile(file);
});
while (true) {
    const option = readlineSync
        .question("Choose List All or List [Account] or Import [File]: ")
        .trim();
    if (option === "List All") {
        bank.listAll();
    } else if (option.startsWith("List [") && option.endsWith("]")) {
        bank.listAccount(option.slice(6, -1).trim());
    } else if (option.startsWith("Import [") && option.endsWith("]")) {
        readFile(option.slice(8, -1).trim());
    } else if (option === "Quit") {
        break;
    } else {
        console.log("Invalid option");
    }
}
