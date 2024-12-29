import express from "express";
import { errorHandleMiddleware } from "./error-handler";
import { PrismaClient } from "@prisma/client";
import "express-async-errors";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
// All code should go below this line
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

// post request to create a new dog
app.post("/dogs", async (req, res) => {
  const { name, breed, description, age } = req.body;

  const errors = [];
  const validKeys = ["name", "breed", "description", "age"];

  const invalidKeys = Object.keys(req.body).filter(
    (key) => !validKeys.includes(key)
  );

  if (invalidKeys.length > 0) {
    invalidKeys.forEach((key) =>
      errors.push(`'${key}' is not a valid key`)
    );
  }

  if (!name || typeof name !== "string")
    errors.push("name should be a string");
  if (!breed || typeof breed !== "string")
    errors.push("breed should be a string");
  if (!description || typeof description !== "string")
    errors.push("description should be a string");
  if (age == null || typeof age !== "number")
    errors.push("age should be a number");

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const newDog = await prisma.dog.create({
      data: { name, breed, description, age },
    });
    res.status(201).json(newDog);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
});

// get request to get all dogs
app.get("/dogs", async (_req, res) => {
  try {
    const allDogs = await prisma.dog.findMany();
    res.status(200).json(allDogs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
});

// get request to get a dog by id
app.get("/dogs/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "id should be a number" });
  }

  try {
    const dog = await prisma.dog.findUnique({
      where: { id },
    });
    if (!dog) {
      return res
        .status(204)
        .json({ error: "Dog not found" });
    }
    res.status(200).json(dog);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
});

// patch request to update a dog by id
app.patch("/dogs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;

  const dog = await prisma.dog.findUnique({
    where: { id },
  });

  if (!dog) {
    return res.status(404).send({ error: "Dog not found" });
  }

  const validKeys = ["name", "breed", "description", "age"];
  const invalidKeys = Object.keys(body).filter(
    (key) => !validKeys.includes(key)
  );
  const errors = [];

  invalidKeys.forEach((key) =>
    errors.push(`'${key}' is not a valid key`)
  );

  const name = body?.name;
  const breed = body?.breed;
  const description = body?.description;
  const age = body?.age;

  if (name && typeof name !== "string") {
    errors.push("name should be a string");
  }
  if (breed && typeof breed !== "string") {
    errors.push("breed should be a string");
  }
  if (description && typeof description !== "string") {
    errors.push("description should be a string");
  }
  if (age && typeof age !== "number") {
    errors.push("age should be a number");
  }

  if (errors.length > 0) {
    return res.status(400).send({ errors });
  }

  try {
    const updatedDog = await prisma.dog.update({
      where: { id },
      data: {
        name,
        breed,
        description,
        age,
      },
    });
    res.status(201).send(updatedDog);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .send({ error: "Internal Server Error" });
  }
});

// delete request to delete a dog by id
app.delete("/dogs/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "id should be a number" });
  }

  try {
    const dog = await prisma.dog.findUnique({
      where: { id },
    });
    if (!dog) {
      return res
        .status(204)
        .json({ error: "Dog not found" });
    }
    await prisma.dog.delete({ where: { id } });
    res.status(200).json(dog);
  } catch (error) {
    console.error(error);
    res
      .status(500)
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
