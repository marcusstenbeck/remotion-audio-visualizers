import { Player } from "@remotion/player";
import React from "react";
import "./styles.css";
import { AllVisualizationsComposition } from "./AllVisualizationsComposition";

export default function App() {
  return (
    <div className="App">
      <Player
        style={{ width: "100%" }}
        component={AllVisualizationsComposition}
        durationInFrames={37 * 30}
        fps={60}
        compositionWidth={1920}
        compositionHeight={1080}
        controls
        loop
      />
    </div>
  );
}
