import dotenv from "dotenv";
import app from "./app";
import { Request, Response } from "express";

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Mess server is running!!!");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
