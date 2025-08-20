import express from "express";
import cors from "cors";
import memberRoute from "./src/routes/memberRoute";

const app = express();
app.use(cors());
app.use(express.json());




app.use('/api/members', memberRoute)

export default app;
