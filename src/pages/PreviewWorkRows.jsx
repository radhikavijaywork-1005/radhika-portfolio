import { Link } from "react-router-dom";
import { work } from "../data/content";
import "./PreviewWorkRows.css";

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

function Row({ item, i }) {
  const disabled = !item.href;
  const isInternal = !disabled && item.href.startsWith("/");
  const Wrapper = disabled ? "div" : isInternal ? Link : "a";
  const wrapperProps = disabled
    ? {}
    : isInternal
    ? { to: item.href }
    : { href: item.href, target: "_blank", rel: "noreferrer" };

  return (
    <div className="pwr-row">
      <div className="pwr-row__text">
        <div className="pwr-row__brand">
          {item.companyIcon && <img src={item.companyIcon} alt="" className="pwr-row__brand-icon" />}
          {item.companyLogo && <img src={item.companyLogo} alt={item.company} className="pwr-row__logo" />}
          {item.companyIcon && (
            <span className="pwr-row__brand-text">
              {item.company}
              {item.companySubtitle && <span className="pwr-row__brand-sub"> {item.companySubtitle}</span>}
            </span>
          )}
        </div>
        <span className="pwr-row__rule" />

        <h3 className="pwr-row__title">{item.title}</h3>

        <div className="tag-list pwr-row__stats">
          {item.stats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
        </div>

        <Wrapper
          className={`pwr-row__cta${disabled ? " pwr-row__cta--disabled" : ""}`}
          {...wrapperProps}
        >
          {item.cta}
          <Arrow />
        </Wrapper>
      </div>

      <div className="pwr-row__visual">
        <img className="pwr-row__shot" src={item.shots[0]} alt="" />
      </div>
    </div>
  );
}

export default function PreviewWorkRows() {
  return (
    <div className="pwr">
      <div className="container">
        <div className="pwr-heading">
          <h2 className="section-heading">Selected work</h2>
          <span className="pwr-heading__rule" />
        </div>

        <div className="pwr-list">
          {work.map((item, i) => (
            <Row key={item.title} item={item} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
