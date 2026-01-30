export type Color = 'blue' | 'green' | 'orange' | 'yellow';

export const COLORS: Color[] = ['blue', 'green', 'orange', 'yellow'];

export const COLOR_TO_NUM: Record<Color, number> = {
  blue: 1,
  green: 2,
  orange: 3,
  yellow: 4,
};

export const COLOR_HEX: Record<Color, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  orange: '#f97316',
  yellow: '#eab308',
};

export function shuffleTarget(): Color[] {
  const colors = [...COLORS];
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }
  return colors;
}

export function computeMatches(guess: Color[], target: Color[]): number {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (guess[i] === target[i]) {
      count++;
    }
  }
  return count;
}

export interface GuessResult {
  guess: Color[];
  matches: number;
}
