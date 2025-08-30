const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require('mongodb').ObjectId;

dotenv.config();
const uri = process.env.MONGO_URI;

let client;
async function connectClient() {
  if(!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }
}

async function getAllUsers(req, res) {
  try {
     await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

async function signup (req, res){
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({
      username
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: []
    };
    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

  res.json({ token, userId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};


async function login(req, res) {
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("server error!");
  }
};


async function getUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(currentID),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
};

async function updateUserProfile(req, res) {

  try {
     await connectClient();

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  if (!currentID) {
    return res.status(400).json({ message: "User ID is missing!" });
  }

  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentID),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    if (!result.value) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(result.value);
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}
async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  if (!currentID) {
    return res.status(400).json({ message: "User ID is missing!" });
  }

  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
}
