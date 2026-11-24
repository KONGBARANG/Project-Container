export default function Footer({ go, auth }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h4>🛒 Small Shop</h4>
          <p>
            A simple online store built with React, Laravel and MySQL,
            running in Docker containers.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><button onClick={() => go('shop')}>Shop</button></li>
            <li><button onClick={() => go('cart')}>Cart</button></li>
            <li>
              {auth ? (
                <button onClick={() => go('orders')}>My Orders</button>
              ) : (
                <button onClick={() => go('login')}>Login / Register</button>
              )}
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>✉️ hello@smallshop.com</li>
            <li>🕒 Mon - Sat: 8:00 - 18:00</li>
            <li>🐳 React · Laravel · MySQL · Docker</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Small Shop. All rights reserved.
      </div>
    </footer>
  )
}