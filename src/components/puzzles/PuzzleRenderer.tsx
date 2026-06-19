import type { Puzzle } from '../../types/game';
import ManualPuzzle from './ManualPuzzle';
import QuizPuzzle from './QuizPuzzle';
import MorsePuzzle from './MorsePuzzle';
import ConnectPuzzle from './ConnectPuzzle';
import TimelinePuzzle from './TimelinePuzzle';
import AccusationPuzzle from './AccusationPuzzle';
import PhotoDecrypt from './PhotoDecrypt';
import CompoundPuzzle from './CompoundPuzzle';
import IcCardPuzzle from './IcCardPuzzle';
import CipherDial from './CipherDial';
import JigsawPuzzle from './JigsawPuzzle';
import HiddenObject from './HiddenObject';

interface PuzzleRendererProps {
  puzzle: Puzzle;
  onSolve: (result?: string) => void;
}

export default function PuzzleRenderer({ puzzle, onSolve }: PuzzleRendererProps) {
  switch (puzzle.type) {
    case 'manual':
      return <ManualPuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'quiz':
      return <QuizPuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'morse':
      return <MorsePuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'connect':
      return <ConnectPuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'timeline':
      return <TimelinePuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'accusation':
      return <AccusationPuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'photo':
      return <PhotoDecrypt puzzle={puzzle} onSolve={onSolve} />;
    case 'iccard':
      return <IcCardPuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'compound':
      return <CompoundPuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'cipher':
      return <CipherDial puzzle={puzzle} onSolve={onSolve} />;
    case 'jigsaw':
      return <JigsawPuzzle puzzle={puzzle} onSolve={onSolve} />;
    case 'hidden':
      return <HiddenObject puzzle={puzzle} onSolve={onSolve} />;
    default:
      return <ManualPuzzle puzzle={puzzle} onSolve={onSolve} />;
  }
}
