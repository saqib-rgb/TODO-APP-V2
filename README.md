# To-Do List App

This is a simple To-Do List application built using Node.js, Express, MongoDB, and EJS for templating. The app allows users to create custom to-do lists by specifying unique URLs, add items, and delete items from the lists.

## Features

- Create and manage custom to-do lists by specifying a custom URL.
- Add new items to the to-do list.
- Delete items from the to-do list.
- Persistent data storage with MongoDB.

## Technologies Used

- Node.js: Backend runtime environment.
- Express.js: Web framework for Node.js.
- MongoDB: NoSQL database for storing list items.
- Mongoose: ODM (Object Data Modeling) library for MongoDB.
- EJS: Embedded JavaScript templates for rendering dynamic content.
- CSS & Bootstrap: For front-end styling.

## Installation

Follow these steps to run the project on your local machine.

### Prerequisites

- Node.js (v12 or higher)
- MongoDB (Make sure you have a MongoDB instance running locally or via a cloud service)

### Setup Instructions

1. Clone the repository:

   git clone https://github.com/your-username/todo-list-app.git

2. Navigate to the project directory:

   cd todo-list-app

3. Install dependencies:

   npm install

4. Start MongoDB:

   Make sure MongoDB is running on your local machine. If MongoDB is installed locally, you can start it using the following command:

   mongod

   Or use MongoDB Atlas for cloud-based MongoDB.

5. Run the application:

   node app.js

6. Access the application:

   Open your browser and go to http://localhost:3000.

## Usage

1. Default List (Today): When you navigate to the root URL http://localhost:3000, a default "Today" list will be shown.
   
2. Create Custom Lists: You can create custom to-do lists by specifying a custom name in the URL. For example, visiting http://localhost:3000/work will create a new to-do list named "Work" if it doesn't already exist.

3. Add Items: Use the input field to add new items to any list, whether it's the default or a custom one.

4. Delete Items: To delete an item, click on the checkbox next to the item, and it will be removed from the list.

## File Structure

.
├── app.js                 # Main server file
├── views
│   ├── list.ejs           # EJS template for rendering lists
│   └── about.ejs          # EJS template for the About page
├── public
│   └── css
│       └── styles.css     # CSS file for front-end styling
├── package.json           # NPM package file
└── README.md              # Project documentation

## Routes

- /: Default to-do list ("Today").
- /:customListName: Create or access a custom to-do list by replacing :customListName with your own list name.
- /about: About page describing the app.

## MongoDB Models

1. Item: Represents a task in a to-do list.
   - Fields:
     - name: The name of the task (string).

2. List: Represents a custom to-do list.
   - Fields:
     - name: The name of the list (string).
     - items: An array of Item objects.

## Example

### Adding Default Items to "Today" List:

const item1 = new Item({ name: "Welcome to your TodoList" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "<-- Hit this to delete an item." });

const defaultItems = [item1, item2, item3];

### Creating a Custom List:

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;
  
  List.findOne({ name: customListName })
    .then(result => {
      if (!result) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save().then(() => res.redirect("/" + customListName));
      } else {
        res.render("list", { listTitle: result.name, newListItems: result.items });
      }
    })
    .catch(err => console.log(err));
});

## Contributing

Pull requests are welcome! If you have any suggestions or bug reports, feel free to open an issue.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Notes

- Make sure MongoDB is running before launching the app.
- Customize the design by modifying the public/css/styles.css file.

