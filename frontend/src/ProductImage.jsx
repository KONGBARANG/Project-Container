import { useState } from 'react'

export default function ProductImage({ product, size = 120 }) {
  const [failed, setFailed] = useState(false)

  if (product.image_url && !failed) {
    return (
      <img
        src={product.image_url}
        alt={product.name}
        className="pimg"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span
      className="pemoji"
      style={{ width: size, height: size, lineHeight: `${size}px`, fontSize: size * 0.5 }}
    >
      {product.emoji}
    </span>
  )
}