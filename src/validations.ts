const validKeys = ["name", "breed", "description", "age"];

export const validateKeys = (
  data: Record<string, unknown>
) => {
  const errors: string[] = [];
  const invalidKeys = Object.keys(data).filter(
    (key) => !validKeys.includes(key)
  );

  if (invalidKeys.length > 0) {
    invalidKeys.forEach((key) =>
      errors.push(`'${key}' is not a valid key`)
    );
  }

  return errors;
};

export const validateName = (name?: unknown) => {
  if (typeof name !== "string")
    return "name should be a string";
  return null;
};

export const validateBreed = (breed?: unknown) => {
  if (typeof breed !== "string")
    return "breed should be a string";
  return null;
};

export const validateDescription = (
  description?: unknown
) => {
  if (typeof description !== "string")
    return "description should be a string";
  return null;
};

export const validateAge = (age?: unknown) => {
  if (typeof age !== "number")
    return "age should be a number";
  return null;
};

export const validateDogData = (
  data: Record<string, unknown>
) => {
  const errors: string[] = [];

  errors.push(...validateKeys(data));

  const nameError = validateName(data.name);
  if (nameError) errors.push(nameError);

  const breedError = validateBreed(data.breed);
  if (breedError) errors.push(breedError);

  const descriptionError = validateDescription(
    data.description
  );
  if (descriptionError) errors.push(descriptionError);

  const ageError = validateAge(data.age);
  if (ageError) errors.push(ageError);

  return errors;
};

export const validateDogUpdate = (
  data: Record<string, unknown>
) => {
  const errors: string[] = [];

  errors.push(...validateKeys(data));

  if ("name" in data) {
    const nameError = validateName(data.name);
    if (nameError) errors.push(nameError);
  }

  if ("breed" in data) {
    const breedError = validateBreed(data.breed);
    if (breedError) errors.push(breedError);
  }

  if ("description" in data) {
    const descriptionError = validateDescription(
      data.description
    );
    if (descriptionError) errors.push(descriptionError);
  }

  if ("age" in data) {
    const ageError = validateAge(data.age);
    if (ageError) errors.push(ageError);
  }

  return errors;
};

export const validateId = (id: number) =>
  isNaN(id) ? "id should be a number" : null;
