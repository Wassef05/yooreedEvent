import { useState, useRef } from 'react';
import { contactService } from '../services/contactService';
import { useSeo } from '../hooks/useSeo';

// Validation helpers
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => !phone || /^(\+216|00216)?[2-9]\d{7}$/.test(phone.replace(/\s/g, ''));
const sanitizeText = (text: string) =>
  text.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();

const MAX_MESSAGE_LENGTH = 2000;

type FieldErrors = Partial<Record<'nom' | 'email' | 'telephone' | 'message', string>>;

export const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);
  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof typeof formData, boolean>>>({});
  const submitRef = useRef<number>(0);

  useSeo({
    title: 'Contact — Parlez-nous de votre projet | Yooreed Events',
    description: 'Contactez l\'équipe Yooreed Events pour parler de vos projets de scénographie, supports de marque et solutions audiovisuelles.',
  });

  const validate = (data: typeof formData): FieldErrors => {
    const e: FieldErrors = {};
    if (!data.nom.trim() || data.nom.trim().length < 2) e.nom = 'Le nom doit contenir au moins 2 caractères.';
    if (!data.email.trim()) e.email = 'L\'email est requis.';
    else if (!isValidEmail(data.email)) e.email = 'Format d\'email invalide.';
    if (!isValidPhone(data.telephone)) e.telephone = 'Format invalide (ex : 98 218 802 ou +216 98 218 802).';
    if (!data.message.trim() || data.message.trim().length < 10) e.message = 'Le message doit contenir au moins 10 caractères.';
    if (data.message.length > MAX_MESSAGE_LENGTH) e.message = `Maximum ${MAX_MESSAGE_LENGTH} caractères.`;
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const sanitized = sanitizeText(value);
    setFormData(prev => ({ ...prev, [name]: sanitized }));
    if (touched[name as keyof typeof touched]) {
      const newErrors = validate({ ...formData, [name]: sanitized });
      setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof FieldErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof FieldErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Rate limiting: 5 seconds between submits
    const now = Date.now();
    if (now - lastSubmit < 5000) return;
    setLastSubmit(now);

    setTouched({ nom: true, email: true, telephone: true, message: true });
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSuccess(false);
    submitRef.current = now;

    try {
      await contactService.sendMessage({
        nom: sanitizeText(formData.nom),
        email: formData.email.trim().toLowerCase(),
        telephone: formData.telephone ? formData.telephone.replace(/\s/g, '') : '',
        sujet: sanitizeText(formData.sujet),
        message: sanitizeText(formData.message),
      });
      setSuccess(true);
      setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' });
      setErrors({});
      setTouched({});
    } catch (error) {
      setErrors({ message: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const InputError = ({ field }: { field: keyof FieldErrors }) =>
    errors[field] && touched[field] ? (
      <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {errors[field]}
      </p>
    ) : null;

  const inputClass = (field: keyof FieldErrors) =>
    `input ${errors[field] && touched[field] ? 'input-error' : touched[field] && !errors[field] ? 'input-success' : ''}`;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#080C14' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label mx-auto inline-flex mb-4">Contact</div>
          <h1 className="section-title mb-4">Parlons de votre projet</h1>
          <p className="max-w-xl mx-auto text-base" style={{ color: '#64748b' }}>
            Notre équipe vous répond sous 24h avec des solutions adaptées à votre événement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-white mb-6">Envoyez-nous un message</h2>

              {success && (
                <div className="mb-6 flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="#6ee7b7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#6ee7b7' }}>Message envoyé avec succès !</p>
                    <p className="text-xs mt-0.5" style={{ color: '#34d399' }}>Notre équipe vous répondra dans les plus brefs délais.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* CSRF token simulé */}
                <input type="hidden" name="_csrf" value={Math.random().toString(36).slice(2)} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="contact-nom" className="block text-sm font-medium text-white mb-2">
                      Nom complet <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="contact-nom"
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Votre nom"
                      className={inputClass('nom')}
                    />
                    <InputError field="nom" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-white mb-2">
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={150}
                      autoComplete="email"
                      placeholder="votre@email.com"
                      className={inputClass('email')}
                    />
                    <InputError field="email" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="contact-telephone" className="block text-sm font-medium text-white mb-2">Téléphone</label>
                    <input
                      id="contact-telephone"
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={20}
                      autoComplete="tel"
                      placeholder="+216 98 000 000"
                      className={inputClass('telephone')}
                    />
                    <InputError field="telephone" />
                  </div>
                  <div>
                    <label htmlFor="contact-sujet" className="block text-sm font-medium text-white mb-2">Sujet</label>
                    <select id="contact-sujet" name="sujet" value={formData.sujet} onChange={handleChange} className="select text-sm">
                      <option value="">Sélectionnez un sujet…</option>
                      <option value="devis">Demande de devis</option>
                      <option value="catalog">Renseignement catalogue</option>
                      <option value="audiovisuel">Audiovisuel & Scénographie</option>
                      <option value="impression">Impression & Branding</option>
                      <option value="supports">Supports Premium</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="contact-message" className="block text-sm font-medium text-white mb-2">
                    Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={5}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder="Décrivez votre projet événementiel, vos besoins et la date souhaitée…"
                    className={`textarea ${inputClass('message')}`}
                  />
                  <div className="flex items-start justify-between mt-1.5">
                    <div><InputError field="message" /></div>
                    <p className="text-xs" style={{ color: formData.message.length > MAX_MESSAGE_LENGTH * 0.9 ? '#fbbf24' : '#475569' }}>
                      {formData.message.length}/{MAX_MESSAGE_LENGTH}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Envoi en cours…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Envoyer le message
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </span>
                  )}
                </button>
                <p className="mt-3 text-xs text-center" style={{ color: '#334155' }}>
                  En soumettant ce formulaire, vous acceptez notre{' '}
                  <a href="/politique-confidentialite" className="underline hover:text-slate-400" style={{ color: '#475569' }}>politique de confidentialité</a>.
                </p>
              </form>
            </div>
          </div>

          {/* ── Infos ────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Info cards */}
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="#a78bfa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                ),
                title: 'Email',
                content: (
                  <button
                    onClick={() => window.location.href = 'mailto:' + atob('Y29udGFjdEBldmVudC55b29yZWVkLmNvbS50bg==')}
                    className="text-sm transition-colors hover:text-violet-300"
                    style={{ color: '#94a3b8' }}
                  >
                    contact&#64;event&#46;yooreed&#46;com&#46;tn
                  </button>
                ),
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="#a78bfa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                ),
                title: 'Téléphone',
                content: (
                  <button
                    onClick={() => window.location.href = 'tel:' + atob('KzIxNjk4MjE4ODAy')}
                    className="text-sm transition-colors hover:text-violet-300"
                    style={{ color: '#94a3b8' }}
                  >
                    &#43;&#50;&#49;&#54; &#57;&#56; &#50;&#49;&#56; &#56;&#48;&#50;
                  </button>
                ),
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="#a78bfa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ),
                title: 'Adresse',
                content: (
                  <a
                    href="https://maps.app.goo.gl/3AJW7JgnTe6SeNpv6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors hover:text-violet-300"
                    style={{ color: '#94a3b8' }}
                  >
                    Novation City, Technopole de Sousse<br />
                    Bâtiment 6000, Sousse 4051, Tunisie
                  </a>
                ),
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="#a78bfa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ),
                title: 'Disponibilité',
                content: <p className="text-sm" style={{ color: '#94a3b8' }}>Lun – Ven : 08h–18h<br />Sam : 09h–13h</p>,
              },
            ].map(({ icon, title, content }, i) => (
              <div key={i} className="flex items-start gap-4 card p-5">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#475569' }}>{title}</p>
                  {content}
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.07)', height: '220px' }}>
              <iframe
                src="https://www.google.com/maps?q=Novation+City+Technopole+de+Sousse+Bâtiment+6000+Sousse+4051+Tunisie&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Yooreed Events — Novation City, Sousse, Tunisie"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
