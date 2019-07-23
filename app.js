const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

mongoose.connect(
  "mongodb+srv://admin:98075331@dbdolucas-p5mis.gcp.mongodb.net/test?retryWrites=true&w=majority",
  // "mongodb+srv://tonho:pncdotonho@cluster0-yj5rn.gcp.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,
    autoReconnect: true
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

// Tentar remover dps que eu upar o front pro servidor
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

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

app.get("/", async (req, res) => {
  try {
    res.send("TA BOMBANDO :D V.2");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(8080, () => console.log("Listening on port 8080"));
