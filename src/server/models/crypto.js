import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the schema
const cryptoSchema = new Schema({
  result: Schema.Types.Mixed,
});

// Create the model
const Crypto = mongoose.models.Crypto || mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
