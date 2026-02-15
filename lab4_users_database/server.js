const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.post("/users", async (req, res) => {
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      const saved = await User.insertMany(payload, { ordered: false });
      return res.status(201).json(saved);
    }

    const user = new User(payload);
    const savedUser = await user.save();
    res.status(201).json(savedUser);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
