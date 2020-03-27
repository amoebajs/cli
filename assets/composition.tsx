import React from "react";
import {
  Composition,
  ReactComposition,
  useReconciler,
  Input,
  ChildrenSlot
} from "@amoebajs/builder";
import { BasicElement } from "./component";
import { GlobalStateDirective } from "./directive";

const Element = useReconciler(BasicElement);
const GlobalState = useReconciler(GlobalStateDirective);

@Composition({
  name: "demo-composition",
  displayName: "Demo布局捆绑",
  version: "0.0.1-beta.0"
})
export class DemoComposition extends ReactComposition {
  @Input()
  public loadingStateName: string = "loading";

  @Input()
  public useChildrenStateScope: boolean = false;

  @Input({ useMap: { key: "string", value: () => true } })
  public childrenStates: Array<[string, any]> = [];

  protected async onRender() {
    const childrenState = this.childrenStates || [];
    let defaultLoadingName = this.loadingStateName;
    if (defaultLoadingName.indexOf(".") > 0) {
      defaultLoadingName = defaultLoadingName.split(".")[0];
    }
    if (childrenState.findIndex(([k, _]) => k === defaultLoadingName) < 0) {
      childrenState.push([defaultLoadingName, false]);
    }
    const eventHandler = {
      vars: [
        "e is args[0]",
        `preState is $(${this.loadingStateName} | bind:state)`,
        `updateState is $(${this.loadingStateName} | bind:setState)`
      ],
      expressions: ["return updateState(!preState)"]
    };
    return (
      <Element>
        <Element.Inputs>
          <Element.layoutBackground value="#8778a4" />
        </Element.Inputs>
        {this.useChildrenStateScope && (
          <GlobalState key="direc01">
            <GlobalState.Inputs>
              <GlobalState.defaultStateName
                value={this.entityId + "_context"}
              />
              <GlobalState.defaultStates
                value={childrenState}
              ></GlobalState.defaultStates>
            </GlobalState.Inputs>
          </GlobalState>
        )}
        <Element key="child01">
          <Element.Inputs>
            <Element.layoutBackground>#276ad7</Element.layoutBackground>
            <Element.layoutHeight>100px</Element.layoutHeight>
          </Element.Inputs>
          <Element key="gridElement01">
            <Element.Inputs>
              <Element.layoutBackground>#8228a4</Element.layoutBackground>
              <Element.layoutHeight>100%</Element.layoutHeight>
            </Element.Inputs>
          </Element>
          <Element key="gridElement02">
            <Element.Inputs>
              <Element.layoutBackground>#67f230</Element.layoutBackground>
              <Element.layoutHeight>100%</Element.layoutHeight>
            </Element.Inputs>
          </Element>
          <Element key="gridElement03">
            <Element.Inputs>
              <Element.layoutBackground>#fe50a3</Element.layoutBackground>
              <Element.layoutHeight>100%</Element.layoutHeight>
            </Element.Inputs>
          </Element>
        </Element>
        <Element key="child02">
          <Element.Inputs>
            <Element.layoutBackground>#56a64e</Element.layoutBackground>
            <Element.layoutHeight>60px</Element.layoutHeight>
          </Element.Inputs>
        </Element>
        <Element key="child03">
          <Element.Inputs>
            <Element.layoutBackground>#a645d3</Element.layoutBackground>
            <Element.layoutHeight>60px</Element.layoutHeight>
          </Element.Inputs>
        </Element>
        <Element key="child04">
          <Element.Inputs>
            <Element.layoutBackground>#fa8701</Element.layoutBackground>
            <Element.layoutHeight>100px</Element.layoutHeight>
          </Element.Inputs>
        </Element>
        <ChildrenSlot />
      </Element>
    );
  }
}
