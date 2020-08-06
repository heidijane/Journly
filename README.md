# Journly

Journly is full-stack application that allows users to create a private journal that can only be seen by their therapist or school counselor. Users can also keep track of their moods using colorful feeling emoji.

Therapists and counselors have recommended journaling for decades. It has been shown to increase mood, communication skills, and mindfulness. It is also one of the cornerstones of the self-care movement. Some people find that writing their thoughts down in a journal and then sharing it with their therapist is a great way to start conversations that would have been difficult to initiate.

Journly allows for this sort of communication in a time when an actual notebook cannot be physically exchanged. Some people are also able to more easily organize their thoughts when typing rather than by writing with pen and paper. Journly also allows for users to communicate their feelings by using various mood emoji’s. This is especially helpful for younger clients who may not be able to express themselves easily through words.

## Technologies

Journly is built in .NET Core with C#. Entity Framework and ADO.NET Core are utilized for communicating with the SQL Server database.
The front-end is built using React and Bootstrap 4/Reactstrap.
Google Firebase is used for user authentication.

## Requirements

- node.js
- npm
- SQL Server
- Google Firebase

## Installation

### Initial Set-up
1. Clone this repo onto your machine
2. You will need to create a new [Google Firebase](https://firebase.google.com/) project to set up the authentication
3. Once you have created your Firebase project, go to the project settings and take note of the Project ID and the API Key.
4. Open the appsettings.json file and replace the FirebaseProjectId value with your own.
5. In the client directory of Journly, create a .env.local file based on the .env.local.example file and replace the value with your Firebase project API Key.

### Setting up the DB
1. Connect to your SQL Server
2. There are two files in the SQL directory of Journly. Run 01_Db_Create.sql to create all the neccessary tables.
3. The second file, 02_Seed_Data.sql sets up the mood emojis, avatars, and user types. It also contains some seed user and post data. You will need to run the first half of the file, but the user data is optional. If you want to create your project without any initial users do not run the SQL commands after the comment on line 244.

### Setting up the users (only do this if you are using the user and post seed data)
On your Google Firebase project, click on the Authentication link. You will need to add users (there are 25 total) that have e-mail addresses that matches the ones in the database. Make sure that you have e-mail verification set to OFF before you add the seed users. Once you've added the users, replace their Firebase UID's in the SQL file with the ones matching your newly created Firebase Users. Then you can run the SQL file.

### Install missing dependencies
1. Navigate to the client folder in your terminal
2. run `npm install` to install any missing packages

## Running the App

1. Start your server. This can be done through Visual Studio. When running through Visual Studio do not use the IIS option!
2. Navigate to the client folder.
3. Type the command `npm start`

*Note: I reccommend registering as a therapist first when testing, especially if you aren't using the user seed data. This way you can click on the "Add Client" button to get your counsellor code which you can then use to register clients for testing purposes.

## Credits and Dependencies
- [OpenMoji](https://openmoji.org/) for the mood and avatar icons
- [Moment.js](https://github.com/moment/moment made formatting dates almost intuitive
- [React Color](https://github.com/casesandberg/react-color) for a wide variety of easy to install and customize color pickers
- [React-Simple-WYSIWYG](https://github.com/megahertz/react-simple-wysiwyg) for a not-too-complicated exactly-what-I-needed WYSIWYG text editor
- [Reactstrap-Date-Picker](https://github.com/megahertz/react-simple-wysiwyg) for an easily customized date input field

## Thank you!
Thank you for checking out my project! I want to thank the instruction team at Nashville Software School and also my fiancee for giving me the idea for this app.
