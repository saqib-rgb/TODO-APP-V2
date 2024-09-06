// Requiring all packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ =require("lodash")

// Creating an instance of the app
const app = express();

// Setting and using EJS, body-parser, and static files
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connecting to the database
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Defining schemas and models
const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Welcome to your TodoList" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "<-- Hit this to delete an item." });

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

// Route for the default list (Today)
app.get("/", function (req, res) {
  Item.find()
    .then(result => {
      if (result.length === 0) {
        // Insert default items if DB is empty, then redirect
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Default items added to DB");
            res.redirect("/");  // Redirect after insertion is complete
          })
          .catch(err => console.log(err));
      } else {
        // Render the list with existing items
        res.render("list", { listTitle: "Today", newListItems: result });
      }
    })
    .catch(err => console.log(err));
});

// Route for custom lists
app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  
  List.findOne({ name: customListName })
    .then(result => {
      if (!result) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save()
          .then(() => res.redirect("/" + customListName))
          .catch(err => console.log(err));
      } else {
        res.render("list", { listTitle: result.name, newListItems: result.items });
      }
    })
    .catch(err => console.log(err));
});

// Adding new items to the list
app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName= req.body.list;
  
  const newItem = new Item({ name: itemName });
  if (listName ==="Today"){
    newItem.save()
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
  }else {
    List.findOne({name:listName})
    .then(result=>{
      result.items.push(newItem)
      result.save()
      res.redirect("/"+listName)
    }).catch(err=>{
      console.log(err)
    })
  }  
});

// Deleting items from the list
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkBox;
  const listName=req.body.listName
  if (listName=="Today"){
    Item.deleteOne({ _id: checkedItemId })
    .then(() => {
      console.log("Item deleted");
      res.redirect("/");
    })
    .catch(err => console.log(err));
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
    .then(()=>{
      res.redirect("/"+listName)
    }).catch(err=>{
      console.log(err)
    })
  }
  
});

// About page route
app.get("/about", function (req, res) {
  res.render("about");
});

// Starting the server
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
