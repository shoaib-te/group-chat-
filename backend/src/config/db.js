import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("Mongoose databaces connect");
  } catch (error) {
    console.log("DB connection is fail");
  }
};
export default connectionDB