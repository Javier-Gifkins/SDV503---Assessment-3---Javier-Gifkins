//NOTE - Ali please press alt Z so this looks a bit nicer :) 



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

function checkPassword(inputPassword) { // function checking if input password matches the const found in setting.js returns boolian value, truthy or falsie depending on the input.
    return inputPassword === settings.adminPassword; // return true if input password scrict equals admin password found in settings. otherwise falsie.
}
function promptForPassword() { // this function prompts the user and calls checkPassword() with their input passed as the parameter. if checkpassword returns true they are given full admin access and the whole patient information file is logged to console. if checkpassword returns false, the user is questioned for their patient id. if it matches any information from the patient information file then that whole matching patient profile is logged to console.

    rl.question("Enter admin password, or press enter to continue as guest: ", (input) => { //user is prompted and the input is asigned the value of whatever they type
        const isAdmin = checkPassword(input); // isAdmin is assigned a boolian value of true or false depending on the outcome of checkPassword()
        
    if (isAdmin) { //if true
        console.log("Admin access granted. You can now CRUD patient data.");
        let allPatients = readAllPatients(); 
        console.log(allPatients); //display entire patient info file
        rl.close(); //closes the readline interface and continue

    } else { //if isAdmin === false
        console.log("Guest access granted. Read-only.");
        rl.question("Enter patient ID to lookup: ", (id) => { //prompts user for input, a Patient ID in this case. and their input is passed to the parameter (id)

        let patient = findPatientByID(id); //varible called patient is assigned the value of our previous users input, after its been passed through the findPatientByID function(a single Patient Profile)

        if (patient) { //findPatientByID returns any data found and is displayed on console
            console.log("\nPatient:", patient);
        } else { //if findPatientByID returns undefined it means user input (id) is not a valid PatientId
            console.log("Not a Valid Patient ID.");
        }
        rl.close(); //closes the readline interface and continue
        });
    }
    });
}


//SECTION - Data Read/Search Functions

function readAllPatients() { //this function returns the entire patient information file as a huge javascript object
    const data = fs.readFileSync(filePath, "utf-8"); // this reads the userData.json file and encodes is as a utf8 string
    return JSON.parse(data); // the entire file in ther form of a string is then parsed and returned as a js object
}
function findPatientByID(id) { //(id)will be a user input and a little utf8 string
    const patients = readAllPatients(); // calls previous function to gather all userdata as a giant huge utf8 string

    return patients.find((p) => p.patientId === id); // uses a find() method to search for the first match with (id) returns undefined if no matching string is found in the patient information file.
}
function adminMenu() {
    console.log("\n=== Admin Menu ==="); // a menu is displayed for data editing purposes
    console.log("1. Create Record");
    console.log("2. Read Record");
    console.log("3. Update Record");
    console.log("4. Delete Record");
    console.log("5. Exit");

    rl.question("Choose an option (1-5): ", (choice) => { //a user is questioned and (choice) is assigned the value of whatever they type
        if (choice === "1") {
            createPatient(); //if user types "1" createPatient() is called
        } else if (choice === "2") {
            rl.question("Enter Patient ID to look up: ", (id) => { //the user wants to search for a patient, their input here becomes the value of (id)
                const patient = findPatientByID(id); //variable patient is asigned the value of the users input after its been passed to the findPatientByID function

                if (patient) { //is matching id is found that matchiong profile is logged to the console
                    console.log("\nPatient Found: ", patient);
                } else {
                    console.log("\nNo patient found with that ID.");
                }
                adminMenu(); // loop back to start
            });
        } else if (choice === "3") {
            editPatientInfo();
        } else if (choice === "4") {
            deletePatient();
        } else if (choice === "5") {
            console.log("Goodbye!");
            rl.close();
        } else {
            console.log("Invalid option. Please try again.");
            adminMenu(); // loop back to start
        }
    });
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

        if (index === -1) {
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



//SECTION - Main Loop








//SECTION - Testing Section



adminMenu()
// deletePatient();
// editPatientInfo();
// createPatient();
// promptForPassword();

// let allPatientInfo = readAllPatients();
// console.log(allPatientInfo);

// let patient = findPatientByID(settings.userLookup);
// console.log("Found Patient: ", patient);

// console.log(settings.adminPassword);
// console.log(generatePatientID());




