//SECTION - Imports

//the are inbulit modules in Node, File System & Readline.
const fs = require("fs");
const readline = require("readline");

//Path is also an inbuilt modeule, this accesses the path to the directory where the current script is found
const path = require("path");
//This creates the full path to the userData.json and stores it in filePath.
const filePath = path.join(__dirname, "../SDV503---Assessment-3---Javier-Gifkins/userData.json");


//Faker in not built in so had to be added to dependancies in the package-lock.json
const {faker} = require("@faker-js/faker")


//this line in inporting all objects from settings.js
const settings = require('./settings');
//this line is "unpacking" the patient infromation array so we can access each value in the array instead of just the hole thing as one object.
const patientInformation = settings.patientInformation;

//this code creates a readline interface in node. its sets up inputs and outputs. allowing us to use these input output methods by using rl.question(). its a good way to handle command line inputs and prompts.
const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
})


//SECTION - Security Functions

function checkPassword(inputPassword) { // function checking if input password matches the const found in setting.js returns boolian value, truthy or falsie depending on the input.
    return inputPassword === settings.adminPassword; // return true if input password scrict equals admin password found in settings. otherwise falsie.
}



//SECTION - Data Read/Search Functions

function readAllPatients() { //this function returns the entire patient information file as a huge javascript object.
    const data = fs.readFileSync(filePath, "utf-8"); // this reads the userData.json file and encodes is as a utf8 string
    return JSON.parse(data); // the entire file in ther form of a string is then parsed and returned as a js object
}
function findPatientByID(id) { //(id)will be a user input and a little utf8 string, then searches the userdata file using the find() method to search for the first match with (id)
    const patients = readAllPatients(); // calls previous function to gather all userdata as a giant huge utf8 string

    return patients.find((p) => p.patientId === id); // uses a find() method to search for the first match with (id) returns undefined if no matching string is found in the patient information file.
}
function adminMenu() { //this function displays a menu for healthcare workers. it displays every option available for CRUD'ing patient data. there are 5 options for this: "1" creates a new record, "2" searches for and displays a single record, "3" is used to edit patient values within a record, "4" deletes an entire patient record, and "5" exits the program.This function uses readline to get user inputs and calls the appropriate function for the job.
    console.log("\n=== Admin Menu ==="); // a menu is displayed for data editing purposes
    console.log("1. Create Record");
    console.log("2. Read Record");
    console.log("3. Update Record");
    console.log("4. Delete Record");
    console.log("5. Exit");

    rl.question("Choose an option (1-5): ", (choice) => { //a user is questioned and (choice) is assigned the value of whatever they type.
        if (choice === "1") {
            createPatient(); //if user types "1" createPatient() is called
        } else if (choice === "2") {
            rl.question("Enter Patient ID to look up: ", (id) => { //the user wants to search for a patient, their input here becomes the value of (id)
                const patient = findPatientByID(id); //variable patient is asigned the value of the users input after its been passed to the findPatientByID function

                if (patient) { //if matching id is found that matchiong patient profile is logged to the console
                    console.log("\nPatient Found: ", patient);
                } else { //no ID matches were found, display error and return to admin menu
                    console.log("\nNo patient found with that ID.");
                }
                adminMenu(); // loop back to start
            });
        } else if (choice === "3") { //if "3" is typed the program calls the edit patient information funtion
            editPatientInfo();

        } else if (choice === "4") { //if "4" is typed the program calls the delete patient record funtion
            deletePatient();

        } else if (choice === "5") { //if "5" is typed the program closes the readline interface and ends program
            console.log("Goodbye!");
            rl.close();
        } else {
            console.log("Invalid option. Please try again."); //no valid option was typed (maybe they typed a 6 or something)
            adminMenu(); // loop back to start
        }
    });
}

//SECTION - Data Editting Functions



function generatePatientID () { // Function to Generate a random ID using faker module e.g. (P-ABH2QUHL).
    return `P-${faker.string.alphanumeric(8).toUpperCase()}` // Gererating a new ID number with faker module ("p-" + 8 random uppercase chars) in string format
}
function savePatients(data) { //this function uses the file system module to stringify the entire userdata file. then write the updated information back into the json file, effectively overwriting it with any udated information.
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
function createPatient() { //this fucntion creates a new patient record by asking the user a series of questions involving patient values, then saves the new patient to the userData file.
    const patient = { patientId: generatePatientID() }; //first a new ID is generated at random. and is assigned to the value of pateintId in the new record.
    let i = 0;

    function nextQuestion() { //is a nested function. and cannot exist globally. its only ever used inside this createPatient function.
        if (i < patientInformation.length) { //if i is less than the legnth of patient information, this means not all questions have been answered yet 
            rl.question(patientInformation[i].prompt, (answer) => { //this displays the question prompt and stores each answer given, saving it to the the patient object  
                patient[patientInformation[i].key] = patientInformation[i].key === "birthDate"
                    ? new Date(answer).toISOString() //if the question is birthDate, the users input is converted to a proper date format (YYYY/MM/DD) then is converted to a string.
                    : answer;
                i++; //i is increased by 1 and saved each time a question is asked
                nextQuestion(); 
            });

        } else { //when i === patientInformation.length, then the patient values have all been answered

            const patients = readAllPatients(); //this reads every existing patient already in the file
            patients.push(patient); //then the newly created document is added to the infromation
            savePatients(patients); //entire updated patient info file is then rewritten to the data file. the new record is only saved once all these patient values have been answered by the user.
            console.log("\nPatient Created:\n", patient); //displays new patient object after its been saved.
            adminMenu(); //back to CRUD menu
        }
    }
    nextQuestion(); //nested function repeats itself.
}



function editPatientInfo() {
    const patients = readAllPatients();

    rl.question("Enter patient ID to edit: ", (id) => {
        const patient = patients.find((p) => p.patientId === id);

        if (!patient) {
            console.log("Patient not found.");
            rl.close();
            adminMenu();
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
                    adminMenu();
                });

            } else {
                console.log("Invalid selection."); // Handles invalid IDs and bad input cleanly.
                adminMenu();
            }
        });
    });
}
function deletePatient() {
    const patients = readAllPatients(); // a variable patients is asigned the value of readallpatients(which reads the entire user file of user data)

    rl.question("Enter an ID to Delete Patient: ", (id) => { //prompts the user top type an ID whatever they type gets stored in (id) then findIndex searchs through the patients array for each patient and checking if patientId matches what has been typed
        const index = patients.findIndex((p) => p.patientId === id);

        if (index === -1) { //is index gets to the very end of the array , then no match has been found
            console.log("No Patient Found with That ID. ")
            adminMenu(); 
            return; //exit function
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

            adminMenu();
        });
    });
}



//SECTION - Main Loop





function mainLoop() { // this function prompts the user and calls checkPassword() with their input passed as the parameter. if checkpassword returns true they are given full admin access and the whole patient information file is logged to console. if checkpassword returns false, the user is questioned for their patient id. if it matches any information from the patient information file then that whole matching patient profile is logged to console.

    rl.question("Enter admin password, or press enter to continue as guest: ", (input) => { //user is prompted and the input is asigned the value of whatever they type
        const isAdmin = checkPassword(input); // isAdmin is assigned a boolian value of true or false depending on the outcome of checkPassword()
        
    if (isAdmin) { //if true
        console.log("Admin access granted. You can now CRUD patient data.");
        let allPatients = readAllPatients(); 
        console.log(allPatients); //display entire patient info file
        adminMenu(); // diplay admin menu right after

    } else { //if isAdmin === false
        console.log("Guest access granted. Read-only.");
        rl.question("Enter patient ID to lookup: ", (id) => { //prompts user for input, a Patient ID in this case. and their input is passed to the parameter (id)

        let patient = findPatientByID(id); //varible called patient is assigned the value of our previous users input, after its been passed through the findPatientByID function(a single Patient Profile)

        if (patient) { //findPatientByID returns any data found and is displayed on console
            console.log("\nPatient:", patient);
        } else { //if findPatientByID returns undefined it means user input (id) is not a valid PatientId
            console.log("Not a Valid Patient ID.");
        }
        adminMenu();
        });
    }
    });
}



//SECTION - Testing Section


mainLoop();

// patient = readAllPatients()
// console.log(patient);


// adminMenu()
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


// console.log(settings);

