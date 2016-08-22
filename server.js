// Strict mode
'use strict';

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
	id: { type: String, required: false }, 
	task: { type: String, required: true },
	complete: { type: Boolean, default: false, required: false }
}, {versionKey: false});

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
		if(err) {
			console.log(err);
			return res.status(404).send("Items cannot be found.");
		}

		console.log("Successfully obtained full list of to-do items.");
		return res.status(200).send(toDoList);
	});
});

// Obtain list of completed items
app.get('/api/todolist/complete', function (req, res) { 
	return listItemModel.find(function (err, toDoList) { 
		if(err) { 
			console.log(err);
			return res.status(404).send("Items cannot be found.");
		}

		toDoList = toDoList.filter(function(processedList){
			return processedList.complete == true;
		});

		console.log("Successfully obtained list of completed to-do items.");
		return res.status(200).send(toDoList);
	});
});

// Obtain list of incomplete items
app.get('/api/todolist/incomplete', function (req, res) { 
	return listItemModel.find(function (err, toDoList) { 
		if(err) { 
			console.log(err);
			return res.status(404).send("Items cannot be found.");
		}

		toDoList = toDoList.filter(function(processedList) {
			return processedList.complete == false;
		});

		console.log("Successfully obtained list of incomplete to-do items.");
		return res.status(200).send(toDoList);
	});
});

// Add To-Do Item
app.post('/api/todolist', function (req, res) {
	if(!req || !req.body.task) {
		console.log("Missing input - error in creating to-do item!"); 
		return res.status(400).send("Missing input - error in creating to-do item!");
	}

	var listItem = new listItemModel({
		task: req.body.task,
		complete: req.body.complete
	});

	listItem.save(function(err) {
		if(err) { 
			console.log(err);	
			return res.status(500).send("Unknown error occurred.");
		} 

		console.log("Successfully created Item.");
		return res.status(201).send(listItem);
	});
});

// Update To-Do Item by ID
app.put('/api/todolist/:id', function (req, res) { 
	// Check if ID is valid
	if((req.params.id).match(/^[0-9a-fA-F]{24}$/)) {
		// Finding the item using the ID
		listItemModel.findById({_id: req.params.id }, function(err, listItem) {
			// If there's a server error
			if(err) {
				console.log(err);
				return res.status(500).send("Unknown server error.");
			// If an item can't be found with the ID
			} else if(!listItem) {
				console.log("Item cannot be found.");
				return res.status(404).send("Item cannot be found.");
			}

			if(!req.body.task && !req.body.complete) { 
				console.log("No input entered for updating item.");
				return res.status(400).send("No input entered for updating item.");
			}

			// If "task" entered in request
			if(req.body.task) {
				listItem.task = req.body.task;
			}

			// If "complete" entered in request
			if(req.body.complete) {
				listItem.complete = req.body.complete;
			}

			// Save change to listItem
			listItem.save(function (err, listItem) {
				if(err) {
					console.log("Unknown server error.");
					return res.status(500).send("Unknown server error.");
				} else if (!listItem) {
					console.log("Failed to update item.");
					return res.status(404).send("Item Not Found.");
				} 
				
				console.log("Updated item!");
				return res.status(200).send(listItem);		
			});
		});
	} else {
		console.log("Invalid ID entered.");
		return res.status(400).send("Invalid ID code entered.");
	}
});

// Delete To-Do Item by ID
app.delete('/api/todolist/:id', function (req, res) { 
	// Check if ID is valid
	if((req.params.id).match(/^[0-9a-fA-F]{24}$/)) {
		// Finding the item using the ID
		listItemModel.findOneAndRemove({_id: req.params.id }, function(err, listItem) {
			if(err) {
				console.log("Unknown server error.");
				return res.status(500).send("Unknown server error.");
			} else if (!listItem) {
				console.log("Item not found.");
				return res.status(404).send("Item not found.");
			} 

			console.log("Item Deleted.");
			return res.status(200).send("Deleted item " + listItem._id + ".");
		});
	} else { 
		console.log("Invalid ID entered.");
		return res.status(400).send("Invalid ID code entered.");
	}
});

// Only for dev purposes
app.delete('/api/todolist/', function (req, res) { 
	return listItemModel.remove({}, function(err) {
		console.log('All data deleted.');
		return res.status(200).send("All data deleted.");
	})
});

// Start server
app.listen(port);
console.log('To-Do List running on port ' + port);
