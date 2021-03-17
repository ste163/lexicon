![Lexicon Logo](/docs/readme_logo-title.svg)
# Lexicon
> Quickly explore Merriam-Webster's Collegiate® Thesaurus and create custom word collections 

![Lexicon Demo GIF](/docs/readme_demo.gif)

## About
Lexicon takes the powerful search capabilities of Merriam-Webster's Thesaurus and allows users to store words they would like to have in their own collections. No more bookmarking, writing down, or trying to memorize words.

### Built with
[React](https://reactjs.org/) <br>
[.NET 5](https://dotnet.microsoft.com/) <br>

## Use the app now
Check out [Lexicon at lexicon-demo.com](https://lexicon-demo.com) <br>

## Technologies used
### Frontend
- [React](https://reactjs.org/) v17.0.1 <br>
- [Firebase](https://firebase.google.com/) v8.2.4 <br>
- [React Router Dom](https://reactrouter.com/) v17.0.1 <br>
- [React Toastify](https://fkhadra.github.io/react-toastify/introduction/) v7.0.1 <br>
- [Merriam-Webster's Collegiate Thesaurus API](https://dictionaryapi.com/products/api-collegiate-thesaurus) <br>

### Backend
- [.NET 5](https://dotnet.microsoft.com/) v5.0.1 <br>
- [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) v5.0.1 <br>
- [Entity Framework Core](https://entityframeworkcore.com/) v5.0.1 <br>
- [xUnit](https://xunit.net/) v2.4.1 <br>
- [Moq](https://github.com/moq/moq4) v4.16.0 <br>

## Entity Relationship Diagram (ERD) and Mockup
|ERD|Mockup|
| ----- | ----- |
| ![Entity Relationship Diagram](/docs/readme_erd.png) | ![Mockup](/docs/readme_mockup.png)
## Credits and Acknowledgements
- Logo design - [Shannon Swenton](https://www.linkedin.com/in/shannon-swenton-aa5356176/) <br>
- Mockup, logo, and icons designed with - [Inkscape](https://inkscape.org/) <br>
- Entity Relationship Diagram created with [dbdiagram](https://dbdiagram.io/) <br>
- GIF screen recording - [screentogif](https://www.screentogif.com/) <br>
- Readme design - [Art of README](https://github.com/noffle/art-of-readme#readme) and [Standard Readme](https://github.com/RichardLitt/standard-readme) <br>

## Developer setup
Instructions for setting up the backend and frontend for furthering Lexicon's development.

### Firebase
You will need to create a Firebase project to have working authentication and authorization.
- Go to [Firebase](https://firebase.google.com/) and create a project (can be named anything)
- In the project settings, you will need your ```Project Id``` and ```Web API Key```

### Merriam-Webster
You will need to sign up for a free Merriam-Webster developer account to access the Thesaurus API. Ensure you select [Merriam-Webster's Collegiate Thesaurus](https://dictionaryapi.com/products/api-collegiate-thesaurus) as the API to use.

### Getting the Project
In the directory of your choice, from the terminal, run:
```git clone https://github.com/ste163/lexicon_fullstack.git```

### Backend
- In ```Lexicon\appsettings.json ``` change the ```"FirebaseProjectId": "lexicon-fullstack"``` to your projects ```Project Id```
- In ```Lexicon\SQL``` run ```01_Db_Create.sql``` then ```02_Seed_Data.sql``` to generate the database and starter data
- If you want access to the ```admin@email``` account created from the seed data, you will need to replace the generic data in the ```FirebaseUserId``` column with the Id generated from Firebase, which you can find on your project's page

### Frontend
- In ```Lexicon\client``` create a file called ```.env.local```
- Inside this file copy and paste: 

    ```
    REACT_APP_API_KEY=FirebaseAPIKey
    REACT_APP_MW_THESAURUS_API_KEY=MerriamWebsterAPIKey
    ```
- Replace the API keys with your unique keys
- Once the files are added run ```npm install``` to add all necessary files
- To start the development server run ```npm start``` from the client directory