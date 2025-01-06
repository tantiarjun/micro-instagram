import express from "express";
import user from "./routes/user";
import post from "./routes/post";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
dotenv.config();
app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// apis
app.use("/api", user);
app.use("/api", post);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
