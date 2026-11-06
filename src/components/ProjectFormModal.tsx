import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, X, Check } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode: boolean;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  isLightMode,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Lock background scrolling and attach ESC key listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      description: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div
      id="project-form-view"
      className={`fixed inset-0 z-50 overflow-y-auto flex flex-col justify-between p-6 md:p-10 transition-colors duration-300 animate-in fade-in duration-200 select-none ${
        isLightMode ? 'bg-[#F5F1EB] text-[#121316]' : 'bg-[#0D0E11] text-[#F7F7F8]'
      }`}
    >
      {/* Top Header Bar */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between pb-6">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity group cursor-pointer"
          data-cursor="BACK"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to portfolio</span>
        </button>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-current/15 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          title="Close form"
          data-cursor="CLOSE"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Centered Form Card — ONLY the form is visible */}
      <main className="max-w-xl w-full mx-auto my-auto py-4">
        <div
          id="project-form"
          className={`p-7 sm:p-10 rounded-2xl border shadow-2xl transition-all duration-300 relative select-text ${
            isLightMode
              ? 'bg-white border-[#121316]/10 text-[#121316] shadow-neutral-300/60'
              : 'bg-[#141519] border-white/10 text-white shadow-black/80'
          }`}
        >
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                Project Request Received!
              </h3>
              <p className="text-sm opacity-75 max-w-md mx-auto leading-relaxed">
                Thank you,{' '}
                <span className="font-semibold text-emerald-400">
                  {formData.name}
                </span>
                . I've received your project details and will review them and reach out via{' '}
                <span className="font-semibold">{formData.email}</span> within 24 hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer ${
                    isLightMode
                      ? 'bg-[#121316] text-white hover:bg-black'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                  data-cursor="CLICK"
                >
                  Back to portfolio
                </button>
                <button
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-medium border border-current/20 hover:border-current/50 transition-colors opacity-75 hover:opacity-100 cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-current/10 pb-4 mb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Start a project
                  </h3>
                  <p className="text-xs opacity-60 font-mono mt-0.5">
                    Tell me what you'd like to build
                  </p>
                </div>
                <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold uppercase">
                  Inquiry
                </span>
              </div>

              {/* 1. Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="project-name-input"
                  className="block text-xs font-mono uppercase tracking-wider opacity-70"
                >
                  Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="project-name-input"
                  name="name"
                  type="text"
                  required
                  autoFocus
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name or company"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    isLightMode
                      ? 'bg-neutral-50 border-neutral-300 text-black placeholder:text-neutral-400 focus:border-black'
                      : 'bg-neutral-900/60 border-neutral-700/60 text-white placeholder:text-neutral-500 focus:border-white'
                  }`}
                />
              </div>

              {/* Grid for Contact Number and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 2. Contact Number */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="project-phone-input"
                    className="block text-xs font-mono uppercase tracking-wider opacity-70"
                  >
                    Contact number <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="project-phone-input"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 90955 44095"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      isLightMode
                        ? 'bg-neutral-50 border-neutral-300 text-black placeholder:text-neutral-400 focus:border-black'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-white placeholder:text-neutral-500 focus:border-white'
                    }`}
                  />
                </div>

                {/* 3. Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="project-email-input"
                    className="block text-xs font-mono uppercase tracking-wider opacity-70"
                  >
                    Email <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="project-email-input"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      isLightMode
                        ? 'bg-neutral-50 border-neutral-300 text-black placeholder:text-neutral-400 focus:border-black'
                        : 'bg-neutral-900/60 border-neutral-700/60 text-white placeholder:text-neutral-500 focus:border-white'
                    }`}
                  />
                </div>
              </div>

              {/* 4. Description (About project) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="project-desc-input"
                  className="block text-xs font-mono uppercase tracking-wider opacity-70"
                >
                  Description (About project) <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  id="project-desc-input"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project, goals, key deliverables, and timeline..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y min-h-[110px] ${
                    isLightMode
                      ? 'bg-neutral-50 border-neutral-300 text-black placeholder:text-neutral-400 focus:border-black'
                      : 'bg-neutral-900/60 border-neutral-700/60 text-white placeholder:text-neutral-500 focus:border-white'
                  }`}
                />
              </div>

              {/* 5. Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-full font-semibold text-xs tracking-tight transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                  isLightMode
                    ? 'bg-[#121316] text-white hover:bg-black'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
                data-cursor="SUBMIT"
              >
                <span>{isSubmitting ? 'Sending Request...' : 'Submit'}</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isLightMode ? 'bg-white text-black' : 'bg-black text-white'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Bottom Minimal Footer Strip */}
      <footer className="max-w-2xl w-full mx-auto pt-6 text-center text-[11px] font-mono opacity-40">
        <span>Confidential • Direct with Boobalan • Response within 24h</span>
      </footer>
    </div>
  );
};

