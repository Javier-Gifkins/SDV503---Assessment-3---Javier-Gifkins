//SECTION - Imports

const fs = require("fs");
const readline = require("readline");

const path = require("path");
const settings = require('./settings');
const filePath = path.join(__dirname, "../SDV503---Assessment-3---Javier-Gifkins/userData.json");

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
})


//SECTION - Functions

function checkPassword(inputPassword) {
    return inputPassword === settings.adminPassword;
}

function readAllPatients() {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

function findPatientByID(id) {
    const patients = readAllPatients();
    return patients.find((p) => p.patientId === id);
}


function promptForPassword() {
    rl.question("Enter admin password to get full access, or press enter to continue as guest: ", (input) => {
    const isAdmin = checkPassword(input);

    if (isAdmin) {
        console.log("Admin access granted! You can CRUD patient data.");
        let allPatients = readAllPatients();
        console.log(allPatients);
        rl.close();
    } else {
        console.log("Guest access - read-only access by patient ID.");
        rl.question("Enter patient ID to lookup: ", (id) => {
        let patient = findPatientByID(id);
        if (patient) {
            console.log("\nPatient found:", patient);
        } else {
            console.log("No patient found with that ID.");
        }
        rl.close();
        });
    }
    });
}











//SECTION - Testing Section

promptForPassword();

// let allPatientInfo = readAllPatients();
// console.log(allPatientInfo);

// let patient = findPatientByID(settings.userLookup);
// console.log("Found Patient: ", patient);

// console.log(settings.adminPassword);
