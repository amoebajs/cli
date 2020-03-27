import * as fs from "fs-extra";
import * as path from "path";
import { spawnSync } from "child_process";
import { IContent, rimraf, copy, YARN } from "./base";

export async function createModule(context: IContent) {
  fs.mkdirSync(context.emit, { recursive: true });
  const result = spawnSync(
    "git",
    [
      "clone",
      "https://github.com/amoebajs/basic-modules.git",
      context.moduleName
    ],
    {
      cwd: context.emit,
      env: process.env,
      stdio: ["pipe", process.stdout, process.stderr]
    }
  );

  if (result.status !== 0) {
    throw new Error("create module failed: fork template repo failed.");
  }

  const rootDir = path.join(context.emit, context.moduleName);

  try {
    await rimraf(path.join(rootDir, ".git"));
  } catch (error) {
    console.log(error);
    throw new Error("create module failed: rm .git folder failed.");
  }

  try {
    const packagePath = path.join(rootDir, "package.json");
    const packageJson = JSON.parse(
      fs.readFileSync(packagePath, { encoding: "utf8" })
    );
    packageJson.name = context.moduleName;
    packageJson.version = "0.0.0";
    packageJson.repository = "your_repo.get";
    packageJson.contributors = [];
    packageJson.license = "MIT";
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, "  "), {
      encoding: "utf8",
      flag: "w+"
    });
  } catch (error) {
    console.log(error);
    throw new Error("create module failed: init repo metadata failed.");
  }

  const srcDir = path.join(rootDir, "src");

  try {
    await rimraf(srcDir);
    fs.mkdirSync(srcDir, { recursive: true });
  } catch (error) {
    console.log(error);
    throw new Error("create module failed: clean source code folder failed.");
  }

  const assestDir = path.resolve(__dirname, "..", "assets");

  try {
    await copy([path.join(assestDir, "*")], srcDir);
  } catch (error) {
    console.log(error);
    throw new Error("create module failed: generate demo code failed.");
  }

  const result3 = spawnSync(YARN, {
    cwd: rootDir,
    env: process.env,
    stdio: ["pipe", process.stdout, process.stderr]
  });

  if (result3.status !== 0) {
    throw new Error("create module failed: install depts with yarn failed.");
  }

  console.log("========Success=========");
  console.log("Module Name: " + context.moduleName);
  console.log("Module Dir: " + context.emit);
  console.log("");
}
