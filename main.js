//SECTION - Imports

const fs = require("fs");
const readline = require("readline");



const {faker} = require("@faker-js/faker")
const path = require("path");
const settings = require('./settings');
const filePath = path.join(__dirname, "../SDV503---Assessment-3---Javier-Gifkins/userData.json");

const patientInformation = settings.patientInformation;

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
})


//SECTION - Security Functions

function checkPassword(inputPassword) { 
    return inputPassword === settings.adminPassword; // return true if inpu password scrict equals admin password found in settings.
}
function promptForPassword() {
    rl.question("Enter admin password, or press enter to continue as guest: ", (input) => {
        const isAdmin = checkPassword(input); // isAdmin is defned as 
        
    if (isAdmin) {
        console.log("Admin access granted. You can now CRUD patient data.");
        let allPatients = readAllPatients();
        console.log(allPatients);
        rl.close();
    } else {
        console.log("Guest access granted. Read-only.");
        rl.question("Enter patient ID to lookup: ", (id) => {
        let patient = findPatientByID(id);
        if (patient) {
            console.log("\nPatient:", patient);
        } else {
            console.log("Not a Valid Patient ID.");
        }
        rl.close();
        });
    }
    });
}


//SECTION - Data Read/Search Functions

function readAllPatients() {
    const data = fs.readFileSync(filePath, "utf-8"); // this reads the userData.json file and encodes is as a utf8 string
    return JSON.parse(data); // the string is then pasred and returned as a js object
}
function findPatientByID(id) {
    const patients = readAllPatients(); // calls previous function to gather all userdata as a utf8 string
    return patients.find((p) => p.patientId === id); // uses a find() method to search for the first ID match. returns undefined if no match is found.
}
function seeOwnInfo() {
    if(checkPassword === false) { // not admin
        const data = fs.readFileSync(filePath, "utf-8"); // this reads the userData.json file and encodes is as a utf8 string
        return JSON.parse(data); // the string is then pasred and returned as a js object
    }
}
function readAllPatients() {
    const data = fs.readFileSync(filePath, "utf-8"); // this reads the userData.json file and encodes is as a utf8 string
    return JSON.parse(data); // the string is then pasred and returned as a js object
}


//SECTION - Data Editting Functions

function generatePatientID () { // Function to Generate a random ID (P-ABH2QUHL)
    return `P-${faker.string.alphanumeric(8).toUpperCase()}` // Gererating a new ID number with faker module
}
function savePatients(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
function createPatient() {
    const patient = { patientId: generatePatientID() };
    let i = 0;

    function nextQuestion() {
        if (i < patientInformation.length) {
            rl.question(patientInformation[i].prompt, (answer) => {
                patient[patientInformation[i].key] = patientInformation[i].key === "birthDate"
                    ? new Date(answer).toISOString()
                    : answer;
                i++;            
                nextQuestion(); 
            });

        } else {

            const patients = readAllPatients();
            patients.push(patient);
            savePatients(patients);
            console.log("\nPatient Created:\n", patient);
            rl.close();
        }
    }
    nextQuestion();
}
function editPatientInfo() {
    const patients = readAllPatients();

    rl.question("Enter patient ID to edit: ", (id) => {
        const patient = patients.find((p) => p.patientId === id);

        if (!patient) {
            console.log("Patient not found.");
            rl.close();
            return;
        }

        console.log("\nSelect the number of the field you want to edit:");
        patientInformation.forEach((field, index) => { // Uses the shared patientInformation array for DRYness.
            console.log(`${index + 1}. ${field.prompt} (${patient[field.key]})`); // Shows numbered options with current values.
        });

        rl.question("\nType number to edit: ", (choice) => {
            const index = parseInt(choice) - 1; // Lets the user choose which field to update.

            if (index >= 0 && index < patientInformation.length) {
                const field = patientInformation[index];

                rl.question(`Enter new ${field.prompt}`, (newValue) => {
                    patient[field.key] = field.key === "birthDate"
                        ? new Date(newValue).toISOString()
                        : newValue;

                    savePatients(patients);
                    console.log("\nUpdated patient:\n", patient);
                    rl.close();
                });

            } else {
                console.log("Invalid selection."); // Handles invalid IDs and bad input cleanly.
                rl.close();
            }
        });
    });
}

function deletePatient() {
    const patients = readAllPatients();

    rl.question("Enter an ID to Delete Patient: ", (id) => {
        const index = patients.findIndex((p) => p.patientId === id);

        if (index < -1) {
            console.log("No Patient Found with That ID. ")
            rl.close();
            return;
        }
        console.log("Patient Found! ");
        console.log(patients[index]);

        rl.question("Are you sure you want to delete this patient? (yes/no): ", (confirm) => {
            if (confirm.toLowerCase() === "yes") {
                patients.splice(index, 1); // remove patient at index
                savePatients(patients); // save updated data
                console.log("✅ Patient deleted.");
            } else {
                console.log("❎ Deletion cancelled.");
            }

            rl.close();
        });
    });
}



// commit "Slight restructuring of the code, added a deletePatient function."



//SECTION - Testing Section



deletePatient();
// editPatientInfo();

// createPatient();

// promptForPassword();

// let allPatientInfo = readAllPatients();
// console.log(allPatientInfo);

// let patient = findPatientByID(settings.userLookup);
// console.log("Found Patient: ", patient);

// console.log(settings.adminPassword);
// console.log(generatePatientID());




