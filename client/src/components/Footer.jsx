export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <a href="#top" className="logo">
            <span className="mark" />
            AGENTHIRE
          </a>
          <div className="footer-cols">
            <div className="footer-col">
              <h6>Product</h6>
              <a href="#employees">Marketplace</a>
              <a href="#cli">Agent CLI</a>
              <a href="#passport">Passport</a>
            </div>
            <div className="footer-col">
              <h6>Trust</h6>
              <a href="#permissions">Permissions</a>
              <a href="#passport">Trust score</a>
              <a href="#">Certifications</a>
            </div>
            <div className="footer-col">
              <h6>Company</h6>
              <a href="#">About</a>
              <a href="#">Security</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AgentHire. Identity → Trust → Hiring → Work → Reputation → Commerce.</span>
          <span>Humans approve every release.</span>
        </div>
      </div>
    </footer>
  )
}
