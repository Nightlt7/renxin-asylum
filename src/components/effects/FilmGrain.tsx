/**
 * 胶片颗粒叠加层
 * 使用 SVG filter 生成细腻的 noise 纹理，模拟老电影的颗粒感
 * pointer-events-none，不影响交互
 */
export default function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[98] opacity-[0.04]"
      aria-hidden="true"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#film-grain)"
        />
      </svg>
    </div>
  );
}
