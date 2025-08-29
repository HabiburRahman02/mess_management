import express from "express";
import cors from "cors";
import memberRoute from "./src/routes/memberRoute";
import depositRoute from "./src/routes/depositRoute";
import mealRoute from "./src/routes/mealRoute";
import errorHandler from "./src/middlewares/errorHandler";

const app = express();
// middlewares
app.use(cors());
app.use(express.json());

// global err handler
app.use(errorHandler)

// routes
app.use('/api/members', memberRoute)
app.use('/api/deposits', depositRoute)
app.use('/api/meals', mealRoute)




export default app;
