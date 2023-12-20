import dotenv from "dotenv";
import { app } from "./app";

// load .env file
dotenv.config();

// start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
