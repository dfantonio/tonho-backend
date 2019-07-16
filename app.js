const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/tonho-backend", {
  useNewUrlParser: true,
  useCreateIndex: true
});

const giftSchema = new mongoose.Schema({
  gift: {
    type: String,
    required: true,
    unique: true
  },
  check: {
    type: Boolean,
    default: false
  },
  name: {
    type: String
  }
});

const Gift = mongoose.model("Gift", giftSchema);

app.post("/gifts", async (req, res) => {
  const gift = new Gift(req.body);
  console.log(req.body);
  try {
    await gift.save();
    res.send(gift);
  } catch (error) {
    res.send(error);
  }
});

app.get("/gifts", async (req, res) => {
  try {
    res.send(await Gift.find({}));
  } catch (error) {
    res.send(error);
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));
