const request = require("supertest");
const app = require("../../../app");
const { closeDB, connectDB, dropTable } = require("../../db/db");
const mongoose = require("mongoose");
const db = process.env.mongoURI;
const Mockgoose = require("mockgoose").Mockgoose;
const mockgoose = new Mockgoose(mongoose);

describe("/POST /api/v1", () => {
	beforeAll(async () => {
		await connectDB();
	});
	afterAll(async () => {
		await closeDB();
	});
	afterEach(async () => {
		await dropTable();
	});

	describe("Register", () => {
		describe("Failed", () => {
			test("Should failed bcz lack of data", async () => {
				const data = [{ email: "tiyas.reza", fullName: "andre ktp", password: "sultanajabre" }, { email: "tiyas.reza@gmail.com", fullName: "a", password: "sultanajabre" }, { email: "tiyas.reza@gmail.com", fullName: "andre ktp", password: "21sa" }, { email: "tiyas.reza@gmail.com", password: "sultanajabre" }, { email: "tiyas.reza@gmail.com", fullName: "andre ktp" }, { fullName: "andre ktp", password: "sultanajabre" }, {}];
				for (let index = 0; index < data.length; index++) {
					const response = await request(app).post("/api/v1/register").send({
						email: data[index].email,
						fullName: data[index].fullName,
						password: data[index].password,
					});
					expect(response.statusCode).toBe(404);
				}
			});
		});
		test("Should return token", async () => {
			const response = await request(app).post("/api/v1/register").send({
				email: "tiyas.akbar@gmail.com",
				fullName: "AndreKTP",
				password: "tiyasakbar",
			});
			expect(response.body.data).toHaveProperty("token");
		});
	});

	describe("Login", () => {
		test("Should return token", async () => {
			await request(app).post("/api/v1/register").send({
				email: "tiyas.akbar@gmail.com",
				fullName: "AndreKTP",
				password: "tiyasakbar",
			});
			const response = await request(app).post("/api/v1/login").send({
				email: "tiyas.akbar@gmail.com",
				password: "tiyasakbar",
			});
			expect(response.body.data.token).toBeDefined();
		});
	});
});
