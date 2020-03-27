import { createContent, ACTION } from "./base";
import { createModule } from "./module";

if (ACTION !== "module") {
  throw new Error("only action [module] is supported.");
}

const context = createContent();

createModule(context)
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
