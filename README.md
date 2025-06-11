# Project Overview:


### Functionality:
The patient Health Management System will allow patients to manage and update health records stored in a .json format. This program will be able to query this json data as if it’s a lightweight document style database, where each document represents a patient.
The project is to develop a command line program enabling users to create, read, update, and delete medical information. At the beginning I will have a prompt asking for an administrator password, if no password can be given the user may only be able to view their own records (no writing new data).


:smile:


This program will organise and edit fictional patient records in the form of .json files. This program will read, edit, delete, or recall results. It will keep records private unless accessed by a doctor or someone with the right permissions, or if accessed by a patient, only their records will be readable. I also want all my options to be editable in a separate settings folder for maximum maintainability.

[*Link to Github Repository*](https://github.com/Javier-Gifkins/SDV503---Assessment-3---Javier-Gifkins.git)


### Best Coding Practices Checklist


- [x] Maintain consistent indentation throughout code
- [x] Use camelCase for variables and functions
- [X] Follow DRY (Don't Repeat Yourself) principles
- [x] Keep line lengths reasonable and readable
- [x] Separate code and data (JSON, JS)
- [X] Maintain consistent file structure
- [X] Keep documentation up to date (Readme, Comments)
- [x] Declare variables with const or let (avoid var)
- [x] Use strict equality operators (=== and !==)
- [x] Add comments for complex logic
- [X] Handle errors with try-catch blocks
- [x] Use camelCase for variable and function names




### Instructions/Requirements

Software Needed:
-	Node.js (version 14.0 or higher)

Dependencies:
-	@faker-js/faker

INSTALLATION
-	Install Node.js from nodejs.org
-	Open a Node terminal inside vscode
-	Run: ‘npm install @faker-js/faker’
-	Run The Program: Type “node main.js”

Starting the Program:
-	Enter correct password or press Enter for guest access.

Guest Access:
-	Can only view 1 patient record at a time
-	Enter patient ID to see medical information
-	Cannot edit or delete

Admin Access:
-	Password: password123
-	Has the Ability to create, read, update, and delete patient records

Admin Menu Options:
-	Create Record - Add new patient
-	Read Record - View patient by ID
-	Update Record - Edit patient information
-	Delete Record - Remove patient
-	Exit - Close program

Patient Information Fields:
-	Patient ID. Automatically generated as P-XXXXXXXX
-	Name
-	Email
-	Phone
-	Address
-	City
-	Country
-	Job Title
-	Birth Date (use format: yyyy/MM/DD)
-	Blood Type




### Program Workflow

![Logo](Images/PatientWorkflow.png.png)


### Key Functions

JSON.parse() / JSON.stringify() (to manage the data)
createPatientRecord()
newRecord()
searchRecord()
updateRecord()
saveRecord()
deleteRecord()