import type { Character } from '../data/characters';
import { characterById, characterByName, findCharacterInText } from '../data/characters';

interface CharacterAvatarProps {
  id?: string;
  name?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 text-base',
};

// 不同剪影轮廓：在 100×100 坐标系内绘制头部+肩部
const silhouettePaths: Record<Character['silhouette'], string> = {
  default:
    'M50 20 C66 20 74 32 74 45 C74 55 68 62 60 65 C72 68 88 80 95 95 L5 95 C12 80 28 68 40 65 C32 62 26 55 26 45 C26 32 34 20 50 20 Z',
  round:
    'M50 22 C64 22 72 33 72 45 C72 54 67 61 60 65 C72 68 86 80 92 95 L8 95 C14 80 28 68 40 65 C33 61 28 54 28 45 C28 33 36 22 50 22 Z',
  sharp:
    'M50 20 C65 20 73 33 73 46 C73 55 68 62 60 65 L82 95 L18 95 L40 65 C32 62 27 55 27 46 C27 33 35 20 50 20 Z',
  hooded:
    'M50 12 C70 12 82 28 82 46 C82 58 76 67 66 71 C78 76 90 84 96 96 L4 96 C10 84 22 76 34 71 C24 67 18 58 18 46 C18 28 30 12 50 12 Z',
};

export default function CharacterAvatar({
  id,
  name,
  text,
  size = 'md',
  showName = false,
  className = '',
}: CharacterAvatarProps) {
  let character: Character | undefined;
  if (id) {
    character = characterById(id);
  } else if (name) {
    character = characterByName(name);
  } else if (text) {
    character = findCharacterInText(text);
  }

  if (!character) return null;

  const initials = character.name.slice(0, 1);
  const path = silhouettePaths[character.silhouette] || silhouettePaths.default;

  return (
    <span
      className={`inline-flex items-center gap-2 align-middle ${className}`}
      title={`${character.name}${character.role === 'patient' ? '（病人）' : character.role === 'player' ? '（玩家）' : '（NPC）'}`}
    >
      <span
        className={`relative inline-flex flex-none items-center justify-center overflow-hidden rounded-full border-2 ${sizeClasses[size]}`}
        style={{
          backgroundColor: character.color,
          borderColor: character.accent,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full opacity-60"
          aria-hidden="true"
        >
          <path d={path} fill="#ffffff" />
        </svg>
        <span className="relative z-10 font-bold leading-none text-white drop-shadow">
          {initials}
        </span>
      </span>
      {showName && (
        <span className="text-sm text-asylum-paper">{character.name}</span>
      )}
    </span>
  );
}
