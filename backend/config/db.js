const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGO_URI}${process.env.DB_NAME}`
    );
    console.log(`Connecting to ${conn.connection.host}`);
  } catch (e) {
    console.log(`connect failed: ${e.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
