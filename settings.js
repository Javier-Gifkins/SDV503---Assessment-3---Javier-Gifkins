//SECTION - Settings

const adminPassword = "password123"
const userLookup = "P-XGOYBH2F"

const patientInformation = [
    { key: "name", prompt: "Name: " },
    { key: "email", prompt: "Email: " },
    { key: "phone", prompt: "Phone: " },
    { key: "address", prompt: "Address: " },
    { key: "city", prompt: "City: " },
    { key: "country", prompt: "Country: " },
    { key: "jobTitle", prompt: "Job Title: " },
    { key: "birthDate", prompt: "Birth Date (yyyy/MM/DD): " },
    { key: "bloodType", prompt: "Blood Type: " }
];










//SECTION - Exporting Those Settings

module.exports = {
    adminPassword,
    userLookup,
    patientInformation
    
};