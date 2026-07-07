import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMessageSquare, FiPhone } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import { apiPost } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function Support() {
  const { auth } = useStore();
  const token = auth?.token;
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!auth?.user) return;
    setForm((prev) => ({
      ...prev,
      name: auth.user.name || prev.name,
      email: auth.user.email || prev.email,
    }));
  }, [auth]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (feedback.text) setFeedback({ type: '', text: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const data = await apiPost('/support', form, token);
      setFeedback({ type: 'success', text: data.message });
      setForm((prev) => ({
        ...initialForm,
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
      }));
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'Could not send your message' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container page-main">
      <div className="support-layout">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card support-info"
        >
          <p className="info-eyebrow">Customer Support</p>
          <h1 className="page-title">We&apos;re here to help</h1>
          <p className="info-lead">
            Have a question about an order, product, or your account? Send us a message and our team
            will respond as soon as possible.
          </p>

          <div className="support-contact-list">
            <p><FiMail /> hello@northstar.com</p>
            <p><FiPhone /> +92 3123456789</p>
            <p><FiMessageSquare /> Replies within 24 hours</p>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card support-form-card"
        >
          <h2>Send your message</h2>
          <form className="support-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                className="store-input"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your name"
                required
              />
            </label>
            <label>
              Email
              <input
                className="store-input"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@email.com"
                required
              />
            </label>
            <label>
              Subject
              <input
                className="store-input"
                value={form.subject}
                onChange={handleChange('subject')}
                placeholder="How can we help?"
                required
              />
            </label>
            <label>
              Message
              <textarea
                className="store-input support-textarea"
                value={form.message}
                onChange={handleChange('message')}
                placeholder="Tell us more about your issue or question..."
                rows={6}
                required
              />
            </label>

            {feedback.text && (
              <p className={feedback.type === 'success' ? 'support-success' : 'support-error'}>
                {feedback.text}
              </p>
            )}

            <button type="submit" className="btn support-submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
