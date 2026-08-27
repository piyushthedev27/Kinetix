import { Pause, Play, RotateCcw } from "lucide-react";

type ReplayControlsProps = {
  playing: boolean;
  onToggle: () => void;
  onReset: () => void;
  caption?: string;
};

export function ReplayControls({
  playing,
  onToggle,
  onReset,
  caption = "Values come from the shared projectile model",
}: ReplayControlsProps) {
  return (
    <footer className="live-lab__controls">
      <button type="button" className="lab-control lab-control--play" onClick={onToggle}>
        {playing ? <Pause size={15} /> : <Play size={15} />}
        {playing ? "Pause" : "Resume"}
      </button>
      <button type="button" className="lab-control" onClick={onReset}>
        <RotateCcw size={15} />
        Restart
      </button>
      <span>
        <i />
        {caption}
      </span>
    </footer>
  );
}
