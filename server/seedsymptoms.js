import mongoose from "mongoose";
import dotenv from "dotenv";
import Symptom from "./models/symptoms.js";

dotenv.config();

const symptoms = [
  { name: "Fever" },
  { name: "Cough" },
  { name: "Body Ache" },
  { name: "Sneezing" },
  { name: "Runny Nose" }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Symptom.deleteMany({});
    await Symptom.insertMany(symptoms);
    console.log("Symptoms seeded");
    process.exit();
  })
  .catch(err => console.error(err));
