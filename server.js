var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// Database
mongoose.connect('mongodb://localhost/todolist');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error!'));
db.once('open', function() {
	// We're Connected!
});

// Setting up To-Do List Item Schema
var Schema = mongoose.Schema;

// List Item Schema
var listItem = new Schema({ 
	task: { type: String, required: true },
	complete: { type: Boolean, required: true }
});

// Create List Item Model
var listItemModel = mongoose.model('listItem', listItem);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 8080; // set our port

// Detect API 
app.get('/api', function (req, res) {
	res.send('To-Do List API is running.');
});

// Obtain full To-Do List
app.get('/api/todolist', function (req, res) {
	return listItemModel.find(function (err, toDoList) {
		if(!err) {
			return res.send(toDoList);
		} else { 
			return console.log(err);
		}
	});
});

// Add To-Do Item
app.post('/api/todolist', function (req, res) {
	var listItem;
	listItem = new listItemModel({
		//id: req.body.id,
		task: req.body.task,
		complete: req.body.complete
	});

	listItem.save(function (err) {
		if(!err) { 
			return console.log("Created Item.");
		} else { 
			return console.log(err);
		}
	});
	return res.send(listItem);
});

// Update To-Do Item by ID
app.put('/api/todolist/:id', function (req, res) { 
	if((req.params.id).match(/^[0-9a-fA-F]{24}$/)) {
		listItemModel.findById({_id: req.params.id }, function(err, listItem) {
			if(err) {
				console.log(err);
			} else if(listItem) {
				listItem.task = req.body.task;
				listItem.complete = req.body.complete;

				listItem.save(function (err, listItem) {
					if(!err || listItem) {
						console.log("Updated item!");
					} else {
						console.log(err);
					}
					return res.send(listItem);
				});
			} else {
				console.log("Failed to update item.");
				return res.status(404).send("404 - Item Not Found.");
			}
		});
	} else {
		console.log("Failed to update item.");
		return res.status(404).send("404 - Item Not Found.");
	}
});

// Delete To-Do Item by ID
app.delete('/api/todolist/:id', function (req, res) { 
	if((req.params.id).match(/^[0-9a-fA-F]{24}$/)) {
		listItemModel.findOneAndRemove({_id: req.params.id }, function(err, listItem) {
			if(err || !listItem) {
				console.log("Failed to delete item.");
				return res.status(404).send("404 - Item Not Found.");
			} else {
				console.log("Item Deleted.");
			}
			return res.send(listItem);
		});
	} else { 
		console.log("Failed to delete item.");
		return res.status(404).send("404 - Item Not Found.");
	}
});

// Start server
app.listen(port);
console.log('To-Do List running on port ' + port);
