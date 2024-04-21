const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri = "mongodb+srv://localbeeradminkm:slz7yBNzFcTZkkFq@localbeerdb.ba4w3.mongodb.net/?retryWrites=true&w=majority";
const fs = require("fs")

const evernoteString = (string) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export4.dtd">
<en-export export-date="20240208T170203Z" application="Evernote" version="10.75.1">
  <note>
    <title>Lista zakupów</title>
    <created>20240208T170122Z</created>
    <updated>20240208T170134Z</updated>
    <note-attributes>
    </note-attributes>
    <content>
      <![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
        <en-note>
          ${string}
        </en-note>      
      ]]>
    </content>
  </note>
</en-export>`

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

// DB connection
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'FoodApp' },
  (err) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`DB Connected`);
    }
  }
);

app.use(express.static('./frontend/build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());

const selectedSchema = new mongoose.Schema({
  selected: { type: String, required: true, unique: true },
});
const selectedModel = mongoose.model('selected', selectedSchema, 'selected');

const recipesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  categories: Array,
  ingredients: Array,
});
const recipesModel = mongoose.model('recipes', recipesSchema, 'recipes');

const categoriesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  connectedTo: Array
});
const categoriesModel = mongoose.model('categories', categoriesSchema, 'categories');

const ingredientsSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  inRecipes: Array
});
const ingredientsModel = mongoose.model('ingredients', ingredientsSchema, 'ingredients');

const cartSchema = new mongoose.Schema({
  cart: { type: Array, required: true, unique: true },
  date: { type: Date, required: true }
});
const cartModel = mongoose.model('cart', cartSchema, 'cart');

const plannersSchema = new mongoose.Schema({
  label: { type: String, required: true, unique: true },
  id: { type: String, required: true, unique: true },
  pn: Object,
  wt: Object,
  sr: Object,
  czw: Object,
  pt: Object,
  sob: Object,
  nd: Object
});
const plannersModel = mongoose.model('planners', plannersSchema, 'planners');

app.post("/toEvernote", (req, res) => {
  fs.writeFile("Evernote/CART.enex", evernoteString(req.body), err => {
    if (err) throw err
  })
  res.send('kk')
});

app.get("/selected", (req, res) => {
  selectedModel
    .find({}, (err, items) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occured", err);
      } else {
        res.send(items);
      }
    })
});

app.post("/editSelected/:id", (req, res) => {
  const obj = req.body;
  let response = null;
  selectedModel.findByIdAndUpdate(req.params.id, obj, (err, docs) => {
    if (err) {
      response = err;
    } else {
      response = docs;
    }
  });
  res.send(response);
});

app.get("/recipes", (req, res) => {
  recipesModel
    .find({}, (err, items) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occured", err);
      } else {
        res.send(items);
      }
    })
});

app.post("/addRecipes", (req, res) => {
  recipesModel.create(
    req.body,
    (err) => {
      if (err) {
        res.redirect(404, '/');
      } else {
        res.send('Przepis dodany')
      }
    }
  )
});

app.post("/editRecipes/:id", (req, res) => {
  const obj = req.body;
  let response = null;
  recipesModel.findByIdAndUpdate(req.params.id, obj, (err, docs) => {
    if (err) {
      response = err;
    } else {
      response = docs;
    }
  });
  res.send(response);
});

app.get("/planners", (req, res) => {
  plannersModel
    .find({}, (err, items) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occured", err);
      } else {
        res.send(items);
      }
    })
});

app.post("/addPlanners", (req, res) => {
  plannersModel.create(
    req.body,
    (err) => {
      if (err) {
        console.log(err)
        res.redirect(404, '/');
      } else {
        res.send('Plan dodany')
      }
    }
  )
});

app.post("/editPlanners/:id", (req, res) => {
  const obj = req.body;
  let response = null;
  plannersModel.findByIdAndUpdate(req.params.id, obj, (err, docs) => {
    if (err) {
      response = err;
    } else {
      response = docs;
    }
  });
  res.send(response);
});

app.get("/categories", (req, res) => {
  categoriesModel
    .find({}, (err, items) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occured", err);
      } else {
        res.send(items);
      }
    })
})

app.post("/addCategories", (req, res) => {
  categoriesModel.create(
    req.body,
    (err) => {
      if (err) {
        res.redirect(404, '/');
      } else {
        res.send('Kategoria dodana')
      }
    }
  )
});

app.post("/editCategories/:id", (req, res) => {
  const obj = req.body;
  let response = null;
  categoriesModel.findByIdAndUpdate(req.params.id, obj, (err, docs) => {
    if (err) {
      response = err;
    } else {
      response = docs;
    }
  });
  res.send(response);
});

app.get("/cart", (req, res) => {
  cartModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occured", err);
    } else {
      res.send(items);
    }
  })
})

app.post("/editCart/:id", (req, res) => {
  const obj = req.body;
  let response = null;
  cartModel.findByIdAndUpdate(req.params.id, obj, (err, docs) => {
    if (err) {
      response = err;
    } else {
      response = docs;
    }
  });
  res.send(response);
});

app.get("/ingredients", (req, res) => {
  ingredientsModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occured", err);
    } else {
      res.send(items);
    }
  })
})

app.post("/addIngredient", (req, res) => {
  ingredientsModel.create(
    { name: req.body.name, category: req.body.category },
    (err) => {
      if (err) {
        res.redirect(404, '/');
      } else {
        res.send('Składnik dodany')
      }
    }
  )
});

app.post("/editIngredient/:id", (req, res) => {
  const obj = req.body;
  let response = null;
  ingredientsModel.findByIdAndUpdate(req.params.id, obj, (err, docs) => {
    if (err) {
      response = err;
    } else {
      response = docs;
    }
  });
  res.send(response);
});

const port = "3001";
app.listen(port, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Server listening on port: ${port}`);
  }
});
