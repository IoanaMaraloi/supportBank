export interface XmlTransaction {
    Description: string;
    Value: number;
    Parties: {
        From: string;
        To: string;
    };
    "@_Date": string;
}
