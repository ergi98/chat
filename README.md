# Description

A chat application where you can create private rooms and chat with the friends you choose to. For a demo click [Here](https://who-chats.herokuapp.com/).

\*Note that the image and voice upload are not functional since this app is hosted for free. To test all the features [run the project locally](#running-the-application).

# How it works

1. You can create a room my clicking the **Create Room** button.
2. After the room is created you can invite friends by copying the displayed link
3. Once a friend clicks the link you are both redirected to your chat room
4. After you finish chatting you can logout by clicking on the dot icons (top right)
5. When all the members have left the room all the messages, audio and photos send are deleted.

# Fetaures

- Send and receive text messages
- Send and receive photos from camera roll or capture on the fly
- Send and receive audio messages

# Technologies

Frontend

- React
- Antd Design

Backend

- Node
- Express

Database

- MongoDB

# Running the application

1. Install and run MongoDB in your local machine

- [Guide for Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- [Guide for MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
- [Guide for Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

2. Open the project with your favorite editor. I am choosing VS Code

```
  cd ${PATH_TO_PROJECT}
  code .
```

3. Open the integrated terminal and execute the below command to install the backend dependencies and to run it

```
npm i && npm run serve
```

- If all goes well you should see `Listening on port ...`.

4. Open a new terminal in the project directory and execute this command to install the client dependencies and run it

```
cd ./client && npm i && npm run start
```

- If all goes well you should see a url `http://localhost/...`

5. Navigate to the displayed url.
