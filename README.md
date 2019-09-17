# NodeJS Server with AUTH and Postgres DB

The scope of this project is to produce an Elemental server in sync with a **Postgres Database** and capable of performing autentication of the type **JWT**(JSON Web Token).

This is a project that is going to serve as a basis to the GoBarber web & app application. This is the [challenge #2](https://github.com/Rocketseat/bootcamp-gostack-desafio-02/blob/master/README.md#desafio-02-iniciando-aplica%C3%A7%C3%A3o) presented to the students of RocketSeat **OMNI STACK** bootcamp.

## Initial structure

The basic server structure will be imported from [this GitHub repository](https://github.com/Jeandcc/Elemental-NodeJS-Server).

## 1. Setting up Nodemon + Sucrase

Nodemon will be responsible for realoading the server automatically once it detects a change made to the files of the app. Sucrase is here to allow the use of modern syntax, such as "import from".

### 1.1 Intalling the dependencies.

The code below will install the dependencies locally to our project and make them as DevDependencies, not taking them to the production environment.

`$ yarn add nodemon sucrase -D`

### 1.2 Adding scripts to the package.json

We'll add the following custom script into the package.json file.

At the end, it will look like this:

```
 "scripts": {
   "dev": "nodemon src/server.js",
 },
```

### 1.3 Configuring Nodemon so it runs Sucrase when we call it

To do so, we need to create a file in the root of our application called _nodemon.json_ with the following content:

```
{
 "watch": ["src"],
 "ext": "js",
 "execMap": {
   "js": "sucrase-node src/server.js"
 }
}
```

The JSON above is simple:

- It tells Nodemon to watch for changes on the **src** directory
- It watches for file changes on JS files
- It specifies the executable and the language that should be run by default.

## 2. Setting up Prettier + ESLint + EditorConfig

These softwares will be responsible for formatting the code according to a standard (Airbnb), check for typos and process new syntaxes as "import".

#### Whatis a Linter?

A linter is a program that analyses your source code for possible programmatic and styling errors. ESLint allows you to set rules specific to your project. If you deviate from those rules when writing code ESLint will report them to you. To check out the entire list of rules that ESLint supports follow this [link](https://eslint.org/docs/rules/)

### 2.1 Installing ESLint as a Dev Dependency

To install it, just run this command on the terminal:

`$ yarn add eslint -d`

### 2.2 Initialize ESLint for the project

By running the following code, we'll be prompted to chose some of our preferences

`$ yarn eslint --init`

Make sure to select **Airbnb** style guide for this and a JSON file extension at the end. At the end, you will be prompted to install the Airbnb config to the ESLint preferences

### 2.3 Edit the .eslintrc.json

Make sure to place the following blocks of code to the ESLint configuration file. More rules can be implemented according to necessity:

```
    "prettier/prettier": "error",
    "linebreak-style": 0,
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    camelcase: "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }]
```

> To see ESLint at work, run: `$ ./node_modules/.bin/eslint [server.js]`

### 2.4 Installing Prettier

Run the following code:

`$ yarn add prettier -d`

### 2.5 Syncing Prettier and ESLint

#### Run the following command:

`$ yarn add eslint-config-prettier eslint-plugin-prettier -d`

#### Add Prettier to the "Extends" block of the .eslintrc file:

`"extends": ["airbnb-base", "plugin:prettier/recommended"]`

By doing this we will get Prettier errors included in ESLint errors.

### 2.6 Automating the process

First, we need to **install** the extensions both for Prettier and for ESLint on VSC. After doing so, refresh the code editor and you'll be able to see the changes.

Another useful addition is auto-format on save. Click cmd + "," to open VSCode settings and add this line to workspace settings: `"editor.formatOnSave":true`
Now every time you save your file it will automatically be prettified.

To format the document according to ESLint standards, add this line to the **settings.JSON** file.

`"eslint.autoFixOnSave": true,`

### 2.7 Configuring Prettier

Create a file namde **.prettierrc** and place the following JSON inside. Further configuration can be placed in the future

```
{
  "singleQuote": true,
  "trailingComma": "es5"
}

```

## 2. Setting up Sequilize with Postgres

### 2.1 Adding dependencies

First, we need to install the **Sequelize Dependency** and also the **driver for the database we're going to utilize**

```
yarn add sequelize
yarn add pg pg-hstore

```

### 2.2 Setting up the connection

We need to create a file called _database.js_ inside a config folder and add the information about the server in it. Such as:

```
module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "0304",
  database: "gobarber",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};

```

After creating the file, we need a **file that starts up the database**. It should contain the following code. It should be called **index.js** inside a _database_ folder

```

import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();

```

After doing so, we need to **import the initialization code to our app**. Place the following code inside the _app.js_ file

`import './database';`
