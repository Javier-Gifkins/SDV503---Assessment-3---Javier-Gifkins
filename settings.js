//SECTION - Settings

const adminPassword = "password123"

// userlookup belongs to an older function for logging a profile by ID number
// const userLookup = "P-XGOYBH2F"


// this array is called by many important functions mainly create new patient and edit patient info. it can be easily updated if we require a new field later such as allergies or medications.
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

//these must be exported for the main file to be able to access these settings as objects.
module.exports = {
    adminPassword,
    userLookup,
    patientInformation
    
};