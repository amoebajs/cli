import ts from "typescript";
import {
  Utils,
  Directive,
  ReactDirective,
  Input,
  BasicState,
  VariableGenerator
} from "@amoebajs/builder";

@Directive({
  name: "global-state",
  displayName: "全局状态",
  version: "0.0.1-beta.0"
})
export class GlobalStateDirective extends ReactDirective {
  @Input({ name: "state", useMap: { key: "string", value: "any" } })
  defaultStates: Array<[string, any]> = [];

  @Input({ name: "name" })
  defaultStateName: string = "__CONTEXT__";

  protected async onInit() {
    await super.onInit();
    this.render.setRootState(BasicState.ContextInfo, {
      name: this.defaultStateName
    });
  }

  protected async onAttach() {
    await super.onAttach();
    this.createStates();
    // 延迟创建上下文对象，可以更好的收集变量
    this.render.appendRootFnBeforeRender(() => {
      this.render.appendRootVariable(
        this.defaultStateName,
        this.createContextBody()
      );
    });
  }

  private createContextBody() {
    return ts.createObjectLiteral([
      ts.createPropertyAssignment(Utils.REACT.State, this.createState())
    ]);
  }

  private createStates() {
    this.defaultStates.forEach(([name, value]) =>
      this.render.appendRootState(name, value)
    );
  }

  private createState() {
    return ts.createObjectLiteral(
      this.render.getRootStates().map(i => {
        const name = getReactStateName(i);
        return ts.createPropertyAssignment(
          name,
          ts.createObjectLiteral([
            ts.createPropertyAssignment("value", ts.createIdentifier(name)),
            ts.createPropertyAssignment(
              "setState",
              ts.createIdentifier("set" + Utils.classCase(name))
            )
          ])
        );
      })
    );
  }
}

function getReactStateName(variable: VariableGenerator) {
  // 获取第一个变量内部名（arrayBinding形式的变量是没有名字的，是一个_nxxx的内部名）
  const placeholder = Object.keys(variable["variables"])[0];
  // 获取真实的react组件state名称
  return variable["variables"][placeholder].arrayBinding[0];
}
