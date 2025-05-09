import { confirm, number } from "@inquirer/prompts";
import path, { parse } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import fileSelector from "inquirer-file-selector";
import { validateAPIKeyList } from "../../helpers/validateAPIKeyList.js";

export async function generateAPIKeys() {
  const APIKeyNumber = await number({
    message: "How many APIKeys?",
    required: true,
  });
  const dirPath = await fileSelector({
    message: "Where to save?",
    type: "directory",
    filter: (file) => {
      return file.isDirectory();
    },
  });
  path;
  const filePath = path.join(dirPath, "apiKeys.json");
  const answer = await confirm({
    message: `Create ${APIKeyNumber} APIKeys in ${filePath}`,
  });
  if (!answer) return;
  let teamCount = 0;

  // Check if file exists
  let file: Buffer<ArrayBufferLike> | undefined;
  try {
    file = await readFile(filePath);
    console.log("File already exists, updating file");
  } catch {
    console.log("File does not exist, creating file");
  }
  let currentKeys = [];

  if (file !== undefined) {
    const currentKeysJSON = file.toString();
    try {
      currentKeys = JSON.parse(currentKeysJSON);
      if (!validateAPIKeyList(currentKeys)) {
        throw Error("Invalid");
      }
    } catch {
      console.log("Existing file is invalid");
      return;
    }
    teamCount = currentKeys.length;
    console.log(currentKeysJSON);
  }

  let APIKeys = [];
  for (let i = 0; i < APIKeyNumber; i++) {
    let APIKey = {
      name: "Team" + (teamCount + i + 1),
      apiKey: crypto.randomUUID(),
    };
    APIKeys.push(APIKey);
  }

  await writeFile(filePath, JSON.stringify(currentKeys.concat(APIKeys)));
  console.log(APIKeys);
}

function validateFile(filePath: string) {
  try {
    const path = parse(filePath);
    console.log(path);
    return true;
  } catch (err) {
    return false;
  }
}
