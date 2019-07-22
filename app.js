const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

mongoose.connect(
  "mongodb+srv://tonho:pncdotonho@cluster0-yj5rn.gcp.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);
mongoose.set("useFindAndModify", false);

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
    type: String,
    default: ""
  },
  valor: {
    type: Number,
    default: 0
  },
  mensagem: {
    type: String,
    default: ""
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
    res.status(500).send(error);
  }
});

app.post("/gifts/toggle", async (req, res) => {
  try {
    const gift = await Gift.findOne({ gift: req.body.gift });

    if (gift.check) {
      gift.check = false;
      gift.name = "";
    } else {
      gift.check = true;
      gift.name = req.body.name;
    }
    gift.save();
    res.send(gift);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/gifts/update", async (req, res) => {
  try {
    res.send(
      await Gift.findOneAndUpdate(
        { gift: req.body.gift },
        { $set: req.body },
        {
          new: true
        }
      )
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/gifts/delete", async (req, res) => {
  try {
    await Gift.findOneAndDelete({ gift: req.body.gift });
    res.send("Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/gifts", async (req, res) => {
  try {
    res.send(await Gift.find({}));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));
