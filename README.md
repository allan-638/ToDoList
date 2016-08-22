# ToDoList

The following To-Do List uses a combination of Node.js, Express, MongoDB & Mongoose, and Postman. 

To run, have mongo running and pointing the data/dir in the To-Do List project. Then, go to the project directory in Terminal and enter:
```
node server.js
```
Finally, go to Postman and you should be able to use the API using:

## GET
Use the following endpoint to obtain a FULL list of all todo items:
```
http://localhost:8080/api/todolist
```
	* Returns an array of todo objects


Use the following endpoint to obtain a list of all COMPLETED todo items:
```
http://localhost:8080/api/todolist/complete/
```
	* Returns an array of todo objects, where complete == true


Use the following endpoint to obtain a list of all INCOMPLETE todo items:
```
http://localhost:8080/api/todolist/incomplete/
```
	* Returns an array of todo objects, where complete == false



## POST
Use the following endpoint to create a new todo item:
```
http://localhost:8080/api/todolist/
```
	* "Task" field is mandatory, "Complete" field is optional and defaults to false
	* Returns the created todo object



## PUT
Use the following endpoint to update an existing todo item:
```
http://localhost:8080/api/todolist/:id
```
	* At least one of the "Task" or "Complete" fields must be present in the request
	* Returns the updated todo object



## DELETE
Use the following endpoint to delete an existing todo item:
```
http://localhost:8080/api/todolist/:id
```
	* Returns the id of the deleted todo object


To delete ALL todo objects, send a DELETE request to the following endpoint:
```
http://localhost:8080/api/todolist/
```
	* Returns "All data deleted." message

## SERVER CODES
* 200: successful GET, PUT, or DELETE
* 201: successful POST
* 400: bad request (likely incorrect input)
* 404: not found (object with given ID not found)
* 500: internal server error
