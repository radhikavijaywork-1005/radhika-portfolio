export default function ManualBookingFlowDiagram() {
  return (
    <div className="cs-mbf-sequence">
      <div className="cs-mbf-step">
        <div className="cs-mbf-step-num">1</div>
        <div className="cs-mbf-step-content">
          <h4 className="cs-mbf-step-title">Chart Not Prepared</h4>
          <div className="cs-mbf-actor">
            <span className="cs-mbf-actor-icon">👩🏻‍💼</span>
            <span className="cs-mbf-actor-name">Customer Support</span>
          </div>
          <ul className="cs-mbf-actions">
            <li>Connect with user and collect user details like travel date, full Name etc.</li>
            <li>Pre-book cheapest flight available for travel date</li>
          </ul>
        </div>
      </div>

      <div className="cs-mbf-step">
        <div className="cs-mbf-step-num">2</div>
        <div className="cs-mbf-step-content">
          <h4 className="cs-mbf-step-title">Decision: Confirmed Ticket</h4>
          <div className="cs-mbf-actor">
            <span className="cs-mbf-actor-icon">👨🏻‍💻</span>
            <span className="cs-mbf-actor-name">Tech</span>
          </div>
          <ul className="cs-mbf-actions">
            <li>Automate refund of Trip Assurance fee into TM wallet</li>
          </ul>
        </div>
      </div>

      <div className="cs-mbf-step">
        <div className="cs-mbf-step-num">3</div>
        <div className="cs-mbf-step-content">
          <h4 className="cs-mbf-step-title">Decision: Waitlisted Ticket</h4>
          <div className="cs-mbf-actor">
            <span className="cs-mbf-actor-icon">👩🏻‍💼</span>
            <span className="cs-mbf-actor-name">Customer Support</span>
          </div>
          <ul className="cs-mbf-actions">
            <li>Connect with user & share flight ticket on shared contact details.</li>
            <li>Upload to portal so the user can download from the app too.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
