const REPEATS = 6;

export default function Marquee({ items, speed = 48 }) {
  return (
    <div className="marquee">
      <div
        className="marquee__track"
        style={{ animationDuration: `${speed}s`, "--marquee-repeats": REPEATS }}
      >
        {Array.from({ length: REPEATS }).map((_, rep) => (
          <div className="marquee__group" key={rep} aria-hidden={rep > 0}>
            {items.map((item) => (
              <span className="marquee__item" key={`${rep}-${item}`}>
                {item}
                <span className="marquee__sep">◇</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
