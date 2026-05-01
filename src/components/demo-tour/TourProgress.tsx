import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

interface Props {
  step: number;
  total: number;
  playing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReplay: () => void;
  labels: string[];
}

export const TourProgress = ({ step, total, playing, onPrev, onNext, onTogglePlay, onReplay, labels }: Props) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-3 text-xs font-medium text-muted-foreground">
        <span>Étape {step + 1} / {total}</span>
        <span className="text-foreground">{labels[step]}</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-colors ${
              i < step ? 'bg-primary' : i === step ? 'bg-primary/60' : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={step === 0} className="gap-1">
          <ChevronLeft className="w-4 h-4" /> Précédent
        </Button>
        <Button variant="outline" size="sm" onClick={onTogglePlay} className="gap-1">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {playing ? 'Pause' : 'Lecture'}
        </Button>
        <Button variant="outline" size="sm" onClick={onReplay} className="gap-1">
          <RotateCcw className="w-4 h-4" /> Rejouer
        </Button>
        <Button size="sm" onClick={onNext} disabled={step === total - 1} className="gap-1 gradient-primary">
          Suivant <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
