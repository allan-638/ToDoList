# ToDoList

The following To-Do List uses a combination of Node.js, Express, MongoDB & Mongoose, and Postman. 

Known: currently does not check for valid IDs - if you try entering a random # of characters, server.js will crash.

To run, have mongo running and pointing the data/dir in the To-Do List project. Then, go to the project directory in Terminal and enter:
```
node server.js
```
Finally, go to Postman and you should be able to use the API using:

## GET & POST
```
http://localhost:8080/api/
```

## PUT & DELETE
```
http://localhost:8080/api/:id
```