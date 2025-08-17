import mongoose from "mongoose";

const SymptomSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Symptom = mongoose.model("Symptom", SymptomSchema);
export default Symptom;
