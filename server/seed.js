import mongoose from "mongoose";
import dotenv from "dotenv";
import Disease from "../models/disease.js";

dotenv.config();

const diseases = [
  { name: "Flu", symptoms: ["Fever", "Cough", "Body Ache"], description: "Common viral infection." },
  { name: "Cold", symptoms: ["Sneezing", "Runny Nose"], description: "Mild respiratory infection." }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Disease.deleteMany({});
    await Disease.insertMany(diseases);
    console.log("Diseases seeded");
    process.exit();
  })
  .catch(err => console.error(err));
