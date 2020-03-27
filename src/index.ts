import * as path from "path";
import * as fs from "fs";

const [command, entrypoint, action, ...argv] = process.argv;

console.log(command);
console.log(entrypoint);
console.log(action);
console.log(argv);
