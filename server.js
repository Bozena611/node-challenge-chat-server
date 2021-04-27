const express = require("express");
const cors = require("cors");
const chats = require("./data.json");
const fs = require("fs");
const port = 4001;

const app = express();

app.use(express.json());
app.use(cors());

const messages = chats;

/*const welcomeMessage = [
	{
	  id: 0,
	  from: "Bart",
	  text: "Welcome to CYF chat system!"
	},
];*/


//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
//const messages = [welcomeMessage];
//console.log ('array', messages)

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", function (req, res){
	res.send(chats);
});

app.get("/messages/:id", (req, res) => {
	const id = req.params.id;
	const oneChat = chats.find(el => el.id == id);
	res.send(oneChat);
});

app.post("/messages", (req, res)=> {
	const newChat = req.body;
	chats.push(newChat);
	fs.writeFileSync("./data.json", JSON.stringify(chats, null, 2), ()=>{});
	/* to change json file to normal in data.json
	null - represents the replacer function. (in this case we don't want to alter the process)
	2 - represents the spaces to indent.
	*/
	res.send(chats);
});

app.delete("/messages/:id", (req, res) => {
	const { id } = req.params;
	const chatId = chats.findIndex(el => el.id == id);
	//console.log ('delete', chatId);
	//findIndex returns the index it finds or -1 if it doesn't exist
	if (chatId >= 0) {
		chats.splice(chatId, 1);
		} else {
		res.send(`Item with id=${id} does not exist. Please try again with different id.`);
		res.status(204);
	}
	fs.writeFileSync("./data.json", JSON.stringify(chats, null, 2), ()=>{});
	//res.send(`Deleted id ${chatId}`)
	res.send(chats);
});

app.listen (port, () => {
	console.log (`server is running on port ${port}`)
});



