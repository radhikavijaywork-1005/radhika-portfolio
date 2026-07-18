import { Link } from "react-router-dom";
import { work } from "../data/content";
import "./PreviewWorkStack.css";

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M3 9L9 3M9 3H4M9 3V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StackCard({ item, i }) {
  const disabled = !item.href;
  const isInternal = !disabled && item.href.startsWith("/");
  const Wrapper = disabled ? "div" : isInternal ? Link : "a";
  const wrapperProps = disabled
    ? {}
    : isInternal
    ? { to: item.href }
    : { href: item.href, target: "_blank", rel: "noreferrer" };

  return (
    <div className="pws-card">
      <div className="pws-card__shot-wrap">
        <img className="pws-card__shot" src={item.shots[0]} alt="" />
      </div>

      <div className="pws-card__body">
        <div className="pws-card__brand">
          {item.companyIcon && <img src={item.companyIcon} alt="" className="pws-card__brand-icon" />}
          {item.companyLogo && <img src={item.companyLogo} alt={item.company} className="pws-card__logo" />}
          {item.companyIcon && (
            <span className="pws-card__brand-text">
              {item.company}
              {item.companySubtitle && <span className="pws-card__brand-sub"> {item.companySubtitle}</span>}
            </span>
          )}
        </div>

        <h3 className="pws-card__title">{item.title}</h3>

        <div className="tag-list pws-card__stats">
          {item.stats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
        </div>

        <Wrapper
          className={`pws-card__cta${disabled ? " pws-card__cta--disabled" : ""}`}
          {...wrapperProps}
        >
          {item.cta}
          <Arrow />
        </Wrapper>
      </div>
    </div>
  );
}

export default function PreviewWorkStack() {
  return (
    <div className="pws">
      <div className="container">
        <div className="pws-heading">
          <h2 className="section-heading">Selected work</h2>
          <span className="pws-heading__rule" />
        </div>

        <div className="pws-grid">
          {work.map((item, i) => (
            <StackCard key={item.title} item={item} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
