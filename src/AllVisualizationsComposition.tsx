import { AudioData, useAudioData, visualizeAudio } from "@remotion/media-utils";
import { Audio, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import speechSrc from "../public/speech.mp3";
import musicSrc from "../public/music.mp3";
import { BarsVisualization } from "./visualizations/BarsVisualization";
import { HillsVisualization } from "./visualizations/HillsVisualization";
import { RadialBarsVisualization } from "./visualizations/RadialBarsVisualization";
import { WaveVisualization } from "./visualizations/WaveVisualization";

/**
 * Component API:s
 *
 * There are quite a few props that will allow for
 * customizing the components and easily creating new
 * variations for the end user.
 *
 * You could even expose some props to the end user
 * in a settings panel so they can tweak and create
 * their own variation.
 */

/**
 * Audio Sensitivity
 *
 * Each component takes optional `maxDb` and `minDb` props
 * that affect the "sensitivity" of the visualization.
 * They are set at sensible defaults, but I recommend
 * exposing these properties to the user to they can
 * adjust how much the visualizations react to the audio.
 *
 * Note: decibels are negative values (or zero)!
 * Sensible values for `minDb` and `maxDb` are in the range
 * of -120 to 0.
 */

const combineValues = (length: number, sources: Array<number[]>): number[] => {
  return Array.from({ length }).map((_, i) => {
    return sources.reduce((acc, source) => {
      // pick the loudest value for each frequency bin
      return Math.max(acc, source[i]);
    }, 0);
  });
};

const visualizeMultipleAudio = ({
  sources,
  ...options
}: {
  frame: number;
  fps: number;
  numberOfSamples: number;
  sources: Array<AudioData>;
  smoothing?: boolean | undefined;
}) => {
  const sourceValues = sources.map((source) => {
    return visualizeAudio({ ...options, audioData: source });
  });
  return combineValues(options.numberOfSamples, sourceValues);
};

export const AllVisualizationsComposition = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const speechData = useAudioData(speechSrc);
  const musicData = useAudioData(musicSrc);

  if (!speechData) return null;
  if (!musicData) return null;

  // I suggest using either 1024, or 512.
  // Larger number = finer details
  // Smaller number = faster computation
  const nSamples = 512;

  const visualizationValues = visualizeMultipleAudio({
    fps,
    frame,
    sources: [musicData, speechData],
    numberOfSamples: nSamples
  });

  // optional: use only part of the values
  const frequencyData = visualizationValues.slice(0, 0.7 * nSamples);

  return (
    <Sequence from={0}>
      <Audio src={speechSrc} />
      <Audio src={musicSrc} />

      <div>
        <div
          style={{
            position: "absolute",
            top: 200 * 2,
            left: 32
          }}
        >
          <BarsVisualization
            frequencyData={frequencyData}
            width={560}
            height={120}
            lineThickness={5}
            gapSize={7}
            roundness={2}
            color="#F3B3DC"
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 287 * 2,
            left: 32
          }}
        >
          <BarsVisualization
            frequencyData={frequencyData}
            width={560}
            height={120}
            lineThickness={7}
            gapSize={6}
            roundness={4}
            color="#CBAE9A"
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 382 * 2,
            left: 32
          }}
        >
          <BarsVisualization
            frequencyData={frequencyData}
            width={560}
            height={120}
            lineThickness={2}
            gapSize={4}
            roundness={2}
            color="#A687DF"
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 458 * 2,
            left: 32
          }}
        >
          <BarsVisualization
            frequencyData={frequencyData}
            width={560}
            height={120}
            lineThickness={6}
            gapSize={7}
            roundness={2}
            color="#8DD2DE"
            placement="under"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 388 * 2,
            top: 198 * 2
          }}
        >
          <BarsVisualization
            frequencyData={frequencyData}
            width={297 * 2}
            height={70 * 2}
            lineThickness={3}
            gapSize={4}
            roundness={2}
            color="#EB6A65"
            placement="under"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 530 * 2,
            top: 396 * 2
          }}
        >
          <BarsVisualization
            frequencyData={frequencyData}
            width={420 * 2}
            height={52 * 2}
            lineThickness={16}
            gapSize={0}
            roundness={0}
            color="#A9B6C9"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 325 * 2,
            top: 273 * 2
          }}
        >
          <RadialBarsVisualization
            frequencyData={frequencyData}
            diameter={400}
            innerRadius={100}
            color="#DCBC8A"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 675 * 2,
            top: 309 * 2
          }}
        >
          <HillsVisualization
            frequencyData={frequencyData}
            width={256 * 2}
            height={54 * 2}
            fillColor="#92E1B0"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 600 * 2,
            top: 20 * 2
          }}
        >
          <HillsVisualization
            frequencyData={frequencyData}
            width={353 * 2}
            height={72 * 2}
            fillColor={["#559B59", "#466CF6", "#E54B41"]}
            copies={3}
            blendMode="screen"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 640 * 2,
            top: 120 * 2
          }}
        >
          <HillsVisualization
            frequencyData={frequencyData}
            width={304 * 2}
            height={40 * 2}
            strokeColor="#E9AB6C"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 420 * 2,
            top: 470 * 2
          }}
        >
          <HillsVisualization
            frequencyData={frequencyData}
            width={400 * 2}
            height={60 * 2}
            strokeWidth={2}
            strokeColor="rgb(100, 120, 250, 0.2)"
            fillColor="rgb(70, 90, 200, 0.2)"
            copies={5}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 20 * 2,
            top: 20 * 2
          }}
        >
          <WaveVisualization
            frequencyData={frequencyData}
            width={280 * 2}
            height={125 * 2}
            offsetPixelSpeed={200}
            lineColor={["#EE8482", "teal"]}
            lineGap={(2 * 280) / 8}
            topRoundness={0.2}
            bottomRoundness={0.4}
            sections={8}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 310 * 2,
            top: 20 * 2
          }}
        >
          <WaveVisualization
            frequencyData={frequencyData}
            width={280 * 2}
            height={125 * 2}
            lineColor="#EE8482"
            lines={6}
            lineGap={6}
            sections={10}
            offsetPixelSpeed={-100}
          />
        </div>
      </div>
    </Sequence>
  );
};
