const app = require("./app");
const port = process.env.PORT || 5000;
const { connectDB } = require("./config/db");

connectDB().then(() => {
	app.listen(port, () => {
		console.log(`Server are running on port ${port}`);
	});
});
