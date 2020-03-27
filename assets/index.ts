import { Module } from "@amoebajs/builder";
import { GlobalStateDirective } from "./directive";
import { BasicElement } from "./component";
import { DemoComposition } from "./composition";

@Module({
  name: "demo-module",
  displayName: "Demo基础模块",
  provider: "react",
  components: [BasicElement],
  directives: [GlobalStateDirective],
  compositions: [DemoComposition]
})
export class DemoModule {}
