export default function Header({ page, go, count, auth, logout }) {
  return (
    <header className="site-header">
      <div className="topbar">🚚 Free shipping on orders over $50 &nbsp;·&nbsp; 🔒 Secure checkout</div>

      <div className="mainbar">
        <div className="brand" onClick={() => go('shop')}>
          <span className="logo">🛒</span>
          <div>
            <div className="brand-name">Small Shop</div>
            <div className="brand-tag">Everything you need</div>
          </div>
        </div>

        <nav className="menu">
          <button className={page === 'shop' ? 'active' : ''} onClick={() => go('shop')}>
            🏠 Shop
          </button>
          <button className={page === 'cart' ? 'active' : ''} onClick={() => go('cart')}>
            🛍️ Cart {count > 0 && <span className="badge">{count}</span>}
          </button>

          {auth ? (
            <>
              <button className={page === 'orders' ? 'active' : ''} onClick={() => go('orders')}>
                📦 My Orders
              </button>
              <span className="user-chip">👤 {auth.user.name}</span>
              <button className="ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="login-btn" onClick={() => go('login')}>👤 Login</button>
          )}
        </nav>
      </div>
    </header>
  )
}