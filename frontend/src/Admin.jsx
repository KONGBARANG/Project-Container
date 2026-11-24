import { useEffect, useState } from 'react'
import './App.css'
import ProductImage from './ProductImage'
import { request, load, save } from './api'

const emptyProduct = { name: '', description: '', price: '', emoji: '📦', image_url: '' }

export default function Admin() {
  const [auth, setAuth] = useState(() => load('admin_auth'))
  const [login, setLogin] = useState({ username: '', password: '' })
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyProduct)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const token = auth?.token

  const handleError = (e) => {
    if (e.message === 'Unauthenticated' || e.message === 'Forbidden') {
      save('admin_auth', null)
      setAuth(null)
      setError('Session expired. Please login again.')
    } else {
      setError(e.message)
    }
  }

  const refresh = async () => {
    try {
      setProducts(await request('/products'))
      setOrders(await request('/admin/orders', { token }))
    } catch (e) {
      handleError(e)
    }
  }

  useEffect(() => {
    if (token) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const doLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await request('/admin/login', { method: 'POST', body: login })
      save('admin_auth', data)
      setAuth(data)
      setLogin({ username: '', password: '' })
    } catch (e2) {
      setError(e2.message)
    }
  }

  const logout = async () => {
    try {
      await request('/logout', { method: 'POST', token })
    } catch {
      /* ignore */
    }
    save('admin_auth', null)
    setAuth(null)
  }

  const submitProduct = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    const body = { ...form, price: Number(form.price) }
    try {
      if (editId) {
        await request(`/admin/products/${editId}`, { method: 'PUT', token, body })
      } else {
        await request('/admin/products', { method: 'POST', token, body })
      }
      setMsg(editId ? 'Product updated ✅' : 'Product added ✅')
      setForm(emptyProduct)
      setEditId(null)
      refresh()
    } catch (e2) {
      handleError(e2)
    }
  }

  const startEdit = (p) => {
    setEditId(p.id)
    setForm({ name: p.name, description: p.description || '', price: p.price, emoji: p.emoji, image_url: p.image_url || '' })
    setMsg('')
    window.scrollTo(0, 0)
  }

  const cancelEdit = () => {
    setEditId(null)
    setForm(emptyProduct)
  }

  const removeProduct = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return
    setError('')
    setMsg('')
    try {
      await request(`/admin/products/${p.id}`, { method: 'DELETE', token })
      setMsg('Product deleted ✅')
      refresh()
    } catch (e) {
      handleError(e)
    }
  }

  if (!auth) {
    return (
      <div>
        <div className="header admin-header"><h1>🔐 Admin Login</h1></div>
        <div className="container narrow">
          {error && <div className="error">{error}</div>}
          <form className="form" onSubmit={doLogin}>
            <input placeholder="Username" value={login.username}
              onChange={(e) => setLogin({ ...login, username: e.target.value })} />
            <input type="password" placeholder="Password" value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            <button className="btn green" type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="header admin-header">
        <h1>⚙️ Admin Panel</h1>
        <div className="nav">
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products</button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Orders ({orders.length})</button>
          <span className="user">👤 {auth.user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {msg && <div className="success small">{msg}</div>}

        {tab === 'products' && (
          <>
            <form className="form" onSubmit={submitProduct}>
              <h3>{editId ? `Edit product #${editId}` : 'Add new product'}</h3>
              <div className="row">
                <input placeholder="Emoji" value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
                <input placeholder="Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Price" type="number" step="0.01" min="0" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <input placeholder="Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input placeholder="Image address (https://.../photo.jpg)" value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              {form.image_url && (
                <div>
                  Preview:{' '}
                  <ProductImage
                    key={form.image_url}
                    product={{ name: form.name, image_url: form.image_url, emoji: form.emoji }}
                    size={80}
                  />
                </div>               
              )}
              <div>
                <button className="btn green" type="submit">{editId ? 'Update' : 'Add product'}</button>
                {editId && <button className="btn" type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>}
              </div>
            </form>

            <h3>All products ({products.length})</h3>
            <table>
              <thead>
                <tr><th>#</th><th>Product</th><th>Description</th><th>Price</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.emoji} {p.name}</td>
                    <td>{p.description}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td className="actions">
                      <button className="btn" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn red" onClick={() => removeProduct(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'orders' && (
          <div>
            <h2>All Orders</h2>
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
    </div>
  )
}