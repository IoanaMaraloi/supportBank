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

while (true) {
    const option = readlineSync
        .question(
            "Choose an option:\n" +
                "  List All\n" +
                "  List Account\n" +
                "  Import File\n" +
                "  Export File\n" +
                "  Quit\n" +
                "> "
        )
        .trim();
    if (option.toLowerCase() === "quit") {
        break;
    }
    switch (true) {
        case option.toLowerCase() === "list all":
            bank.listAll();
            break;
        case option.toLowerCase().startsWith("list "):
            bank.listAccount(option.slice(5).toLowerCase().trim());
            break;
        case option.toLowerCase().startsWith("import "):
            readFile(option.slice(7).trim());
            break;
        case option.toLowerCase().startsWith("export "):
            bank.exportTransactions(option.slice(7).trim());
            break;
        default:
            console.log("Invalid option");
            break;
    }

}
