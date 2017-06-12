
module.exports = {
  user: {
    name: String,
    email: String,
    recipes: [String],
    recipesPublic: [String],
    pfp: String,
    verified: Boolean,
    confirmedEmail: Boolean
  },
  password: {
    userId: String,
    salt: String,
    password: String
  },
  recipe: {
    title: String,
    author: String,
    description: String,
    ingredients: [{
      name: String,
      amount: Number,
      measurement: String
    }],
    instructions: [String],
    coverPhoto: String,
    public: Boolean
  },
  calendar: [
    {
      time: Number,
      userId: String,
      recipeId: String
    }
  ]
};
