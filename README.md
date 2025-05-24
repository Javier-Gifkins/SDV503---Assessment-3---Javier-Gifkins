//NOTE -  - Project Overview:

Functionality:
The patient Health Management System will allow patients to manage and update health records stored in a .json format. The project is to develop a command line program enabling users to create, read, update, and delete medical information. At the beginning I will have a prompt asking for an administrator password, if no password can be given the user may only be able to view their own records (no writing).

CRUD is an acronym for:
Create:
-	Create function allows users to create a record in a database, but only someone with administrative permission may create new data.
Read:
-	Read function will work similarly to a search. This will allow the user to retrieve specific records within the data, this may be done using keywords or dates.
Update:
-	The update function will be used to modify records in the data, by allowing certain input. Only those with permission will be able to modify data.
Delete:
-	This will be used to delete records perhaps unused. Some databases have a soft delete option where the data is marked as deleted while leaving it intact. However, in my program I won’t be including this feature.

CRUD principles are essential for almost any data driven application, this program will be no different, relying on manipulating .json files as records.

This program will organise and edit fictional patient records in the form of .json files. This program will read, edit, delete, or recall results. It will keep records private unless accessed by a doctor or someone with the right permissions, or if accessed by a patient, only their records will be readable. I also want all my options to be editable in a separate settings folder for maximum maintainability.

//NOTE - Instructions/Requirements

readline (for input/output in terminal)

fs (for reading/writing JSON files)

JSON.parse() / JSON.stringify() (to manage the data)

Environment: Node.js (install from nodejs.org)

Run it from terminal: using node yourscript.js

Use these built-in Node.js modules:

readline for user input

fs for JSON file storage

No frontend or browser code is needed


//NOTE - Psuedo Code

START
Display "Welcome"

Prompt "Enter administrator password (press Enter to continue without admin): "
INPUT userPassword

IF userPassword == storedAdminPassword THEN
    accessLevel = "admin"
    Display "Access granted: Admin Mode"

ELSE IF userPassword != "admin" THEN
    accessLevel = "limited"
    Display "Limited Access Mode: Read only"

ELSE
    Display "Invalid password."
    EXIT


IF accessLevel == "limited" THEN
    Prompt "Enter your ID to view records: "
    INPUT patientID
    record = findRecordByID(patientID)
    
    IF record exists THEN
        Display record

    ELSE
        Display "No record found."
    EXIT


// ADMIN MODE

WHILE TRUE
    Display 
    "Main Menu: "
    "1. Create Record"
    "2. Read Record"
    "3. Update Record"
    "4. Delete Record"
    "5. Exit"

    INPUT choice

    IF choice == 1 THEN
        Prompt for patient info
        newRecord = createPatientRecord()
        saveToJSON(newRecord)
        Display "Record created."

    ELSE IF choice == 2 THEN
        Prompt "Enter keyword, ID, or date to search: "
        INPUT searchTerm
        result = searchRecords(searchTerm)
        Display result

    ELSE IF choice == 3 THEN
        Prompt "Enter ID of record to update: "
        INPUT recordID
        record = findRecordByID(recordID)
        IF record exists THEN
            Prompt for updates
            updateRecord(record)
            saveToJSON(record)
            Display "Record updated."
        ELSE
            Display "Record not found."
        END IF

    ELSE IF choice == 4 THEN
        Prompt "Enter ID of record to delete: "
        INPUT recordID
        Confirm "Are you sure you want to delete this record? (Y/N): "
        IF yes THEN
            deleteRecordByID(recordID)
            Display "Record deleted."
        END IF

    ELSE IF choice == 5 THEN
        Display "Exiting program."
        BREAK

    ELSE
        Display "Invalid option. Please try again."
   
END

//NOTE - Key Functions

createPatientRecord()
newRecord()
searchRecord()
updateRecord()
saveRecord()
deleteRecord()