const mongoose = require("mongoose");
const db = process.env.mongoURI;

const connectDB = async () => {
	return new Promise((res, rej) => {
		mongoose
			.connect(db, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false,
			})
			.then(() => {
				res();
			});
	});
};

const closeDB = async () => {
	return mongoose.disconnect()
};

module.exports = { connectDB, closeDB };
