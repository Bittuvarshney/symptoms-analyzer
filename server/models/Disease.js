import mongoose from "mongoose";

const DiseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symptoms: { type: [String], required: true },
  description: { type: String, required: true },
});

export default mongoose.model("Disease", DiseaseSchema);
