import express from "express";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";
import { prisma } from "../prisma/prisma-instance";
import HttpStatusCode from "./status-codes";
import {
  validateDogData,
  validateDogUpdate,
  validateId,
} from "./validations";

const app = express();
const {
  OK,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  BAD_REQUEST,
  NOT_FOUND,
} = HttpStatusCode;

app.use(express.json());
// All code should go below this line
app.get("/", (_req, res) => {
  return res.status(OK).json({ message: "Hello World!" });
});

app.get("/dogs", async (_req, res) => {
  try {
    const allDogs = await prisma.dog.findMany();
    res.status(OK).json(allDogs);
  } catch (error) {
    console.error(error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

app.get("/dogs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const idError = validateId(id);

  if (idError) {
    return res
      .status(BAD_REQUEST)
      .json({ message: idError });
  }

  try {
    const dog = await prisma.dog.findUnique({
      where: { id },
    });
    if (!dog) {
      return res
        .status(NO_CONTENT)
        .json({ error: "Dog not found" });
    }
    res.status(OK).json(dog);
  } catch (error) {
    console.error(error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

app.post("/dogs", async (req, res) => {
  const errors = validateDogData(req.body);

  if (errors.length) {
    return res.status(BAD_REQUEST).json({ errors });
  }

  try {
    const newDog = await prisma.dog.create({
      data: req.body,
    });
    return res.status(CREATED).json(newDog);
  } catch (error) {
    console.error(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

app.patch("/dogs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const idError = validateId(id);

  if (idError) {
    return res
      .status(BAD_REQUEST)
      .json({ message: idError });
  }

  const dog = await prisma.dog.findUnique({
    where: { id },
  });

  if (!dog) {
    return res
      .status(NOT_FOUND)
      .send({ error: "Dog not found" });
  }

  const errors = validateDogUpdate(req.body);

  if (errors.length > 0) {
    return res.status(BAD_REQUEST).send({ errors });
  }

  try {
    const updatedDog = await prisma.dog.update({
      where: { id },
      data: req.body,
    });
    res.status(CREATED).send(updatedDog);
  } catch (e) {
    console.error(e);
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ error: "Internal Server Error" });
  }
});

app.delete("/dogs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const idError = validateId(id);

  if (idError) {
    return res
      .status(BAD_REQUEST)
      .json({ message: idError });
  }

  try {
    const dog = await prisma.dog.findUnique({
      where: { id },
    });
    if (!dog) {
      return res
        .status(NO_CONTENT)
        .json({ error: "Dog not found" });
    }
    await prisma.dog.delete({ where: { id } });
    res.status(OK).json(dog);
  } catch (error) {
    console.error(error);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
