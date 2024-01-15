const nameMapping: { [key: string]: string } = {
    "Manawatu Plunderers Football Club": "Plunderers",
    "Groombridge Electrical Feilding Utd C Team": "Feilding",
    "JRM Automotive PN Marist Royals": "Marist"
    // Add more mappings as needed
};

export function getDisplayName(databaseName: string) {
    return nameMapping[databaseName] || databaseName;
}
  