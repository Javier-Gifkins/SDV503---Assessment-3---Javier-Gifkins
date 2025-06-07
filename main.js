//SECTION - Imports & Setup

/**
 * File System & Readline are inbuilt modules in Node. 
 * Path is also an inbuilt module, this accesses the path
 * to the directory where the current script is found
 */
const fs = require("fs");
const readline = require("readline");
const path = require("path");

//This code creates the full path to the userData.json file and stores it in filePath.
const filePath = path.join(__dirname,
    "../SDV503---Assessment-3---Javier-Gifkins/userData.json");

//Faker in not built in, and so has to be added to dependancies in the package-lock.json
const { faker } = require("@faker-js/faker");

/**
 * this code creates a readline interface in node.
 * allowing inputs and outputs by using rl.question().
 * its a good way to handle command line inputs and prompts.
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

//SECTION - Settings

const adminPassword = "password123"

/**
 * this array is called by many important functions 
 * notably the create new patient and edit patient info functions.
 * it can be easily updated if we require a new field later 
 * such as allergies or medications.
 */
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


//SECTION - Security Functions

/**
 * function checking if input password matches the const found in the settings above.
 * returns boolian value when called, truthy if input password scrict
 * equals the admin password found in settings. otherwise falsie.
 */  
function checkPassword(inputPassword) { 
    return inputPassword === adminPassword; 
}


//SECTION - Data Read/Search Functions

/**
 * this function returns the entire patient information file as one javascript object. 
 * this reads the userData.json file and encodes is as a utf8 string
 * it is then parsed and returned as a big javascript object.
 */
function readAllPatients() { 
    const data = fs.readFileSync(filePath, "utf-8"); 
    return JSON.parse(data); 
}

/**
 * (id) will be a user input and a string
 * the program searches the userdata file using the find() method
 * to search for the first match with (id)
 * a previous function is called to gather all userdata as a huge string
 * find() method is used to search for the first match with (id)
 * returns undefined if no matching string is found in the patient information file.
 */
function findPatientByID(id) {
    const patients = readAllPatients(); 
    return patients.find((p) => p.patientId === id); 
}

/**
 * this function displays a menu for data editing purposes.
 * it shows every option available for editting patient data.
 * there are 5 options for this: 
 * "1" creates a new record
 * "2" searches for and displays a single record
 * "3" is used to edit patient values within a record
 * "4" deletes an entire patient record
 * "5" exits the program.
 * This function uses readline to get user inputs
 * then calls the appropriate function for the job.
 */

function adminMenu() {
    console.log("\n=== Admin Menu ==="); 
    console.log("1. Create Record");
    console.log("2. Read Record");
    console.log("3. Update Record");
    console.log("4. Delete Record");
    console.log("5. Exit");

  rl.question('Choose an option (1-5): ', (choice) => {
    switch (choice) {
      case '1':
        createPatient();
        break;
      
      case '2':
        rl.question('Enter Patient ID to look up: ', (id) => {
          const patient = findPatientByID(id);

          if (patient) {
            console.log('\nPatient Found: ', patient);
            adminMenu();
            return;
          }
          
          console.log('\nNo patient found with that ID.');
          adminMenu();
        });
        break;
      
      case '3':
        editPatientInfo();
        break;
      
      case '4':
        deletePatient();
        break;
      
      case '5':
        console.log('Goodbye!');
        rl.close();
        break;
      
      default:
        console.log('Invalid Number. Please try again.');
        adminMenu();
    }
  });
};


//SECTION - Data Editting Functions

/**
 * Function to Generate a random ID using faker module e.g. (P-ABH2QUHL).
 * ("p-" + 8 random uppercase chars) in string format
 */
function generatePatientID () { 
    return `P-${faker.string.alphanumeric(8).toUpperCase()}` 
}

/**
 * this function uses the file system module to stringify the entire userdata file.
 * then it writes the updated information back into the json file
 * effectively overwriting it with any updated information.
 */ 
function savePatients(data) { 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}


/**
 * this fucntion creates a new patient record
 * by asking the user a series of questions involving patient values
 * then it saves the new patient to the userData file.
 */
function createPatient() { 
    const patient = { patientId: generatePatientID() }; 
    let i = 0;

    /**
     * this is a nested function. and cannot exist globally.
     * its only ever used inside this createPatient function.
     * if "i" is less than the length of patient information
     * this means not all questions have been answered yet
     * displays the question prompt and stores each answer given
     * saving it to the the patient object. If the question is birthDate,
     * the users input is converted to a proper date format (YYYY/MM/DD) 
     * then is converted to a string. "i" is increased by 1 and saved each time a question is asked.
     */
    function nextQuestion() { 
        if (i < patientInformation.length) { 
            rl.question(patientInformation[i].prompt, (answer) => {
                patient[patientInformation[i].key] = patientInformation[i].key === "birthDate"
                    ? new Date(answer).toISOString() 
                    : answer;
                i++; 
                nextQuestion(); 
            });

        //when i === patientInformation.length, then the patient values have all been answered
        } else { 


            /**
             * this reads every existing patient already in the file 
             * then the newly created document is added to the patient information 
             * the new record is only saved once all these patient values have been answered by the user. 
             * then displays new patient object after its been saved, and returns to editting menu.
             */
            const patients = readAllPatients();
            patients.push(patient); 
            savePatients(patients); 
            console.log("\nPatient Created:\n", patient); 
            adminMenu();
        }
    }
    //nested function repeats itself.
    nextQuestion(); 
}

/**
 * this function allows an administrator to edit existing patient records. 
 * it lets users select a patient by using patient ID
 * then asks which field they would like to update. 
 * then it saves the changes back into the userData file.
 */
function editPatientInfo() { 
    const patients = readAllPatients(); 
    rl.question("Enter patient ID to edit: ", (id) => { 
        const patient = patients.find((p) => p.patientId === id);

        if (!patient) { 
            console.log("No Patient Match Was Found.");
            adminMenu();
        }
        /**
         * Uses the shared patientInformation array for DRYness.
         * Shows each field with numbered options and current field 
         * +1 is used, because naturally the index starts at 0.
         */
        console.log("\nSelect the number of the field you want to edit:");
        patientInformation.forEach((field, index) => { // 
            console.log(`${index + 1}. ${field.prompt} (${patient[field.key]})`);
        });

        
        // choice here is given the value of a user input (it will be a number)
        rl.question("\nType number to edit: ", (choice) => {
            const index = parseInt(choice) - 1;

            /**
             * the user choose which field to update. then input gets converted back into an array index.
             * this clarifies if the user input is within valid bounds 
             * (above 0 and less than the overall length of the patientInformation array)
             * if  input is valid, this retrieves the chosen field value e.g. emailAddress.
             */
            if (index >= 0 && index < patientInformation.length) {
                const field = patientInformation[index];

                /**
                 * // this will prompt the user to type a new value for the field 
                 * they have previously selected. the input is then stored in newValue
                 * for birthDate the users input is converted to a proper date format (YYYY/MM/DD) 
                 * and is converted to a string before being saved.
                 */
                rl.question(`Enter new ${field.prompt}`, (newValue) => { 
                    patient[field.key] = field.key === "birthDate" //
                        ? new Date(newValue).toISOString()
                        : newValue;

                    savePatients(patients); 
                    console.log("\nUpdated patient:\n", patient);
                    adminMenu(); 
                });

            } else {
                console.log("Invalid selection."); 
                adminMenu(); 
            }
        });
    });
}

/**
 * this function erases a whole user info document when given a matching ID number.
 * prompts the user top type an ID whatever they type gets stored in (id)
 * then findIndex searchs through the patients array for each patient 
 * checking if patientId field matches what has been typed
 * if index gets to the very end of the array (patients), then no match has been found
 * the function double checks deletions before erasing.
 */
function deletePatient() { 
    const patients = readAllPatients();

    rl.question("Enter an ID to Delete Patient: ", (id) => { 
        const index = patients.findIndex((p) => p.patientId === id);

        if (index === -1) { 
            console.log("No Patient Found with That ID. ")
            adminMenu();
            return; 
        }
        // this will log the entire patient profile that was found matching our user input.
        console.log("Patient Found! ");
        console.log(patients[index]); 

        rl.question("Are you sure you want to delete this patient? (yes/no): ", (confirm) => { 
            if (confirm.toLowerCase() === "yes") {

                // remove patient at index, then save all updated userdata
                patients.splice(index, 1);
                savePatients(patients);
                console.log("✅ Patient deleted.");
            } else {
                console.log("❎ Deletion cancelled.");
            }

            adminMenu(); 
        });
    });
}



//SECTION - Main Loop


/**
 * this function prompts the user and calls checkPassword() 
 * with their input passed as the parameter. if checkpassword returns true 
 * they are given full admin access and the whole patient information file is logged to console. 
 * if checkpassword returns false, the user is questioned for their patient id. 
 * if it matches any information from the patient information file then 
 * only that matching patient profile is logged to console.
 */

function mainLoop() { // 

    rl.question("Enter admin password, or press enter to continue as guest: ", (input) => { 
        const isAdmin = checkPassword(input); 
        
    
    // if true, display entire patient info file
    if (isAdmin) { 
        console.log("Admin access granted. You can now edit patient data.");
        let allPatients = readAllPatients(); 
        console.log(allPatients); 
        adminMenu(); 

    } else { 
        console.log("Guest access granted. Read-only.");
        rl.question("Enter patient ID to lookup: ", (id) => { 

        /**
         * varible called patient is assigned the value of our previous users input
         * after its been passed through the findPatientByID function(a single Patient Profile)
         * if findPatientByID returns undefined it means user input (id) is not a valid PatientId
         */
        let patient = findPatientByID(id); 

        if (patient) { 
            console.log("\nPatient:", patient);
        } else { 
            console.log("Not a Valid Patient ID.\n");
        }
        // adminMenu();
        mainLoop();
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

