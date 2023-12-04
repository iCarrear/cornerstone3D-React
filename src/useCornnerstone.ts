import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import * as cornerstoneTools from "@cornerstonejs/tools";
import { RenderingEngine, Enums } from "@cornerstonejs/core";
import {
  convertMultiframeImageIds,
  prefetchMetadataInformation,
} from "./helpers/convertMultiframeImageIds";
import { useEffect, useState } from "react";
import { initDemo } from "./helpers";
import { IStackViewport } from "@cornerstonejs/core/dist/types/types";

const {
  PanTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  ZoomTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;
const toolGroupId = "myToolGroup";

export default function () {
  const state: {
    element: HTMLDivElement | null;
    viewport: IStackViewport | null;
    toolGroupId: string;
  } = {
    element: null,
    viewport: null,
    toolGroupId: "myToolGroup",
  };
  useEffect(() => {
    init();
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);
    loadAndViewImage(imageId);
  };

  const loadAndViewImage = async (imageId: string) => {
    await prefetchMetadataInformation([imageId]);
    const stack = convertMultiframeImageIds([imageId]);
    // Set the stack on the viewport
    state.viewport &&
      state.viewport.setStack(stack).then(() => {
        // Set the VOI of the stack
        // viewport.setProperties({ voiRange: ctVoiRange });
        // Render the image
        state.viewport && state.viewport.render();

        //   const imageData = state.viewport&&state.viewport.getImageData();
      });
  };

  const init = async () => {
    const content = document.getElementById("content");
    const isHandle = document.getElementById("cornerstone-element");
    if (isHandle) return;

    // image div
    const element = document.createElement("div");
    element.oncontextmenu = (e) => e.preventDefault();
    element.id = "cornerstone-element";
    element.style.width = content?.offsetWidth + "px";
    element.style.height = content?.offsetHeight + "px";

    // const div = document.createElement("div");
    // div.style.display = "flex";
    // div.style.flexDirection = "row";

    // const metadata = document.createElement("div");
    // metadata.style.marginLeft = "400px";

    // div.appendChild(element);
    // div.appendChild(metadata);

    state.element = element;

    content && content.appendChild(element);
    await run();
  };

  const run = async () => {
    // Init Cornerstone and related libraries
    await initDemo();

    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.addTool(WindowLevelTool);
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
    cornerstoneTools.addTool(ZoomTool);

    // Define a tool group, which defines how mouse events map to tool commands for
    // Any viewport using the group
    const toolGroup = ToolGroupManager.createToolGroup(toolGroupId)!;

    // Add tools to the tool group
    toolGroup.addTool(WindowLevelTool.toolName);
    toolGroup.addTool(PanTool.toolName);
    toolGroup.addTool(ZoomTool.toolName);
    toolGroup.addTool(StackScrollMouseWheelTool.toolName);

    // Set the initial state of the tools, here all tools are active and bound to
    // Different mouse inputs
    toolGroup.setToolActive(WindowLevelTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary, // Left Click
        },
      ],
    });
    toolGroup.setToolActive(PanTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Auxiliary, // Middle Click
        },
      ],
    });
    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Secondary, // Right Click
        },
      ],
    });
    // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
    // hook instead of mouse buttons, it does not need to assign any mouse button.
    toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);

    // Get Cornerstone imageIds and fetch metadata into RAM

    // Instantiate a rendering engine
    const renderingEngineId = "myRenderingEngine";
    const renderingEngine = new RenderingEngine(renderingEngineId);

    // Create a stack viewport
    const viewportId = "CT_STACK";
    const viewportInput = {
      viewportId,
      type: ViewportType.STACK,
      element: state.element!,
      defaultOptions: {
        background: [0.2, 0, 0.2] as [number,number,number],
      },
    };

    renderingEngine.enableElement(viewportInput);

    // Get the stack viewport that was created
    // state.viewport = renderingEngine.getViewport(viewportId);
    state.viewport = renderingEngine.getStackViewports()[0];

    console.log("fuzhi", state);

    toolGroup.addViewport(viewportId, renderingEngineId);
  };

  return {
    handleFileChange,
  };
}
