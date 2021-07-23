const mongoose = require("mongoose");
const db = process.env.mongoURI;
const Mockgoose = require("mockgoose").Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const connectDB = async () => {
	await mockgoose.prepareStorage();
	await mongoose.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	});
	return true;
};

const closeDB = async () => {
	const { connections } = mongoose;
	const { childProcess } = mockgoose.mongodHelper.mongoBin;
	childProcess && childProcess.kill();
	await Promise.all(connections.map((c) => c.close()));
	await mongoose.disconnect();
	return true;
};

const dropTable = async () => {
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) {
		await collection.remove();
	}
	return true
};

module.exports = { connectDB, closeDB, dropTable };
