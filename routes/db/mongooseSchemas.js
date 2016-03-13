
module.exports = {
  user: {
    name: String,
    email: String,
    id: String,
    recipes: [String],
    shoppingList: [{
      name: String,
      amount: Number,
      measurement: String,
      done: Boolean,
      reminder: Date
    }],
    pfp: String,
    registered: Boolean
  },
  password: {
    id: String,
    salt: String,
    password: String
  }
};
