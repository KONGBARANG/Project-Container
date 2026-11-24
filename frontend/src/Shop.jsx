import { useEffect, useState } from 'react'
import './App.css'
import { request, load, save } from './api'
import ProductImage from './ProductImage'
import Header from './Header'
import Footer from './Footer'

const emptyForm = { customer_name: '', phone: '', address: '' }

function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', username: '', password: '' })
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const data = await request(mode === 'login' ? '/login' : '/register', {
        method: 'POST',
        body: f,
      })
      onAuth(data)
    } catch (e2) {
      setErr(e2.message)
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="tabs">
        <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>Login</button>
        <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => setMode('register')}>Register</button>
      </div>
      {err && <div className="error">{err}</div>}
      {mode === 'register' && (
        <input placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      )}
      <input placeholder="Username" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} />
      <input type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button className="btn green" type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
    </form>
  )
}

export default function Shop() {
  const [page, setPage] = useState('shop') // shop | cart | login | confirm | orders
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [lastOrder, setLastOrder] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [auth, setAuth] = useState(() => load('shop_auth')) // { token, user }

  // ទាញទំនិញ ហើយ Refresh រៀងរាល់ 10 វិនាទី ដើម្បីឃើញការកែពី Admin
  useEffect(() => {
    const loadProducts = (first) =>
      request('/products')
        .then(setProducts)
        .catch(() => {
          if (first === true) setError('Cannot connect to Backend (Laravel)')
        })
    loadProducts(true)
    const timer = setInterval(loadProducts, 10000)
    return () => clearInterval(timer)
  }, [])

  const handleAuth = (data) => {
    save('shop_auth', data)
    setAuth(data)
    setError('')
    setForm((f) => ({ ...f, customer_name: f.customer_name || data.user.name }))
    if (page === 'login') setPage('shop')
  }

  const logout = async () => {
    try {
      await request('/logout', { method: 'POST', token: auth.token })
    } catch {
      /* ignore */
    }
    save('shop_auth', null)
    setAuth(null)
    setOrders([])
    setPage('shop')
  }

  const go = async (p) => {
    setError('')
    setPage(p)
    window.scrollTo(0, 0)
    if (p === 'orders' && auth) {
      try {
        setOrders(await request('/my-orders', { token: auth.token }))
      } catch (e) {
        setError(e.message)
      }
    }
  }

  const addToCart = (product) =>
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id)
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product, quantity: 1 }]
    })

  const changeQty = (id, delta) =>
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    )

  const total = cart.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0)
  const count = cart.reduce((s, i) => s + i.quantity, 0)

  const placeOrder = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await request('/checkout', {
        method: 'POST',
        token: auth.token,
        body: {
          ...form,
          items: cart.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        },
      })
      setLastOrder(data)
      setCart([])
      setForm({ ...emptyForm, customer_name: auth.user.name })
      setPage('confirm')
    } catch (e2) {
      if (e2.message === 'Unauthenticated') {
        save('shop_auth', null)
        setAuth(null)
        setError('Session expired. Please login again.')
      } else {
        setError(e2.message)
      }
    }
  }

  return (
    <div className="app">
      <Header page={page} go={go} count={count} auth={auth} logout={logout} />

      <div className="container">
        {error && <div className="error">{error}</div>}

        {page === 'shop' && (
          <>
            <div className="hero">
              <h2>Welcome to Small Shop</h2>
              <p>Discover great products at the best prices</p>
            </div>
            <div className="grid">
              {products.map((p) => (
                <div className="card" key={p.id}>
                  <div style={{ marginBottom: 6 }}>
                    <ProductImage key={p.image_url} product={p} size={120} />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="price">${Number(p.price).toFixed(2)}</div>
                  <button className="btn" onClick={() => addToCart(p)}>Add to cart</button>
                </div>
              ))}
            </div>
          </>
        )}

        {page === 'login' && (
          <div className="narrow">
            <h2>Login / Register</h2>
            <AuthForm onAuth={handleAuth} />
          </div>
        )}

        {page === 'cart' && (
          <div>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
                  </thead>
                  <tbody>
                    {cart.map((i) => (
                      <tr key={i.product.id}>
                        <td>
                          <ProductImage key={i.product.image_url} product={i.product} size={36} />
                          <span style={{ marginLeft: 8 }}>{i.product.name}</span>
                        </td>
                        <td>${Number(i.product.price).toFixed(2)}</td>
                        <td className="qty">
                          <button onClick={() => changeQty(i.product.id, -1)}>-</button>
                          <span>{i.quantity}</span>
                          <button onClick={() => changeQty(i.product.id, 1)}>+</button>
                        </td>
                        <td>${(Number(i.product.price) * i.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="total">Total: <b>${total.toFixed(2)}</b></div>

                {auth ? (
                  <form className="form" onSubmit={placeOrder}>
                    <h3>Checkout</h3>
                    <input placeholder="Full name" value={form.customer_name}
                      onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                    <input placeholder="Phone" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <input placeholder="Address" value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    <button className="btn green" type="submit">Place Order</button>
                  </form>
                ) : (
                  <div>
                    <div className="notice">🔒 Please login or register to buy</div>
                    <AuthForm onAuth={handleAuth} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {page === 'confirm' && lastOrder && (
          <div className="success">
            <h2>✅ Order Confirmed!</h2>
            <p>Order #{lastOrder.id} for <b>{lastOrder.customer_name}</b></p>
            <p>Total: <b>${Number(lastOrder.total).toFixed(2)}</b></p>
            <p>Saved in MySQL database (shopdb)</p>
            <button className="btn" onClick={() => go('shop')}>Continue shopping</button>
          </div>
        )}

        {page === 'orders' && (
          <div>
            <h2>My Orders</h2>
            {orders.length === 0 && <p>No orders yet.</p>}
            {orders.map((o) => (
              <div className="order-box" key={o.id}>
                <b>Order #{o.id}</b> — {o.customer_name} ({o.phone})<br />
                {o.address}
                <ul>
                  {o.items.map((it) => (
                    <li key={it.id}>
                      {it.product.name} x {it.quantity} = ${(Number(it.price) * it.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <b>Total: ${Number(o.total).toFixed(2)}</b>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer go={go} auth={auth} />
    </div>
  )
}