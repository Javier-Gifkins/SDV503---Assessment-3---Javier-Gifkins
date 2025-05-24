
const fs = require("fs");
const path = require("path");
const settings = require('./settings');

const filePath = path.join(__dirname, "../SDV503---Assessment-3---Javier-Gifkins/userData.json");

function readAllPatients() {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

function findPatientByID(id) {
    const patients = readAllPatients();
    return patients.find((p) => p.patientId === id);
}



//SECTION - Testing Section




let allPatientInfo = readAllPatients();
console.log(allPatientInfo);

let patient = findPatientByID(settings.userLookup);
console.log("Found Patient: ", patient);

console.log(settings.adminPassword);