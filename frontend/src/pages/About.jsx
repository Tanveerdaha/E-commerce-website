import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <main className="container page-main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card info-page"
      >
        <p className="info-eyebrow">About Northstar</p>
        <h1 className="page-title">Minimal luxury for modern life</h1>
        <p className="info-lead">
          Northstar Store was built around a simple idea: everyday essentials should feel elevated,
          reliable, and effortless to shop for.
        </p>

        <div className="info-grid">
          <section>
            <h2>Our story</h2>
            <p>
              We curate products across electronics, fashion, accessories, and home essentials —
              focusing on quality materials, thoughtful design, and fair pricing. Every item in our
              catalog is chosen to blend timeless style with real-world comfort.
            </p>
          </section>
          <section>
            <h2>What we believe</h2>
            <ul className="info-list">
              <li>Quality over quantity in every collection</li>
              <li>Transparent pricing with honest discounts</li>
              <li>Fast checkout and responsive customer support</li>
              <li>A shopping experience that works beautifully on any device</li>
            </ul>
          </section>
        </div>

        <div className="info-actions">
          <Link to="/products" className="btn info-btn-primary">Browse products</Link>
          <Link to="/support" className="btn info-btn-secondary">Contact support</Link>
        </div>
      </motion.div>
    </main>
  );
}
