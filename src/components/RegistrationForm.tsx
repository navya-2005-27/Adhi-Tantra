import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Trophy, 
  Users, 
  User, 
  BookOpen,
  CreditCard,
  CheckCircle2,
  Phone
} from 'lucide-react';

const PROBLEM_STATEMENTS = [
  "Women safety and inclusivity",
  "Green mobility and renewable integration",
  "Reimaging and manufacturing industry 5.0",
  "Next-gen industrial sustainability and adaptive resource",
  "Innovating through hardware to solve India's Real-world challenges"
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0
  })
};

type FormData = {
  teamName: string;
  collegeName: string;
  teamSize: string;
  leaderName: string;
  leaderUSN: string;
  leaderYear: string;
  leaderPhone: string;
  email: string;
  members: { name: string; usn: string }[];
  problemStatement: string;
  paymentUtr: string;
};

const FORMSUBMIT_TARGET = "https://formsubmit.co/adhitantra786@gmail.com";
const FORMSUBMIT_IFRAME_NAME = "formsubmit_hidden_iframe";
const ORGANIZER_EMAIL = "adhitantra786@gmail.com";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const CONFIRMATION_MESSAGE =
  "Your participation in Adhi Tantra is confirmed.\n\nWe will be looking forward to your innovative ideas.\n\nFor any queries, contact:\n\nStudent Coordinators:\n- Kavya GS: +91 9900969105\n- Navyashree SD: +91 9972594105\n\nStaff Coordinators:\n- Mrs. Arpitha K: +91 9880958203\n- Mr. Santhosh BJ: +91 9036156311";

const submitViaHiddenForm = (fields: Record<string, string>) => {
  return new Promise<void>((resolve) => {
  let iframe = document.getElementById(FORMSUBMIT_IFRAME_NAME) as HTMLIFrameElement | null;

  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = FORMSUBMIT_IFRAME_NAME;
    iframe.id = FORMSUBMIT_IFRAME_NAME;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = FORMSUBMIT_TARGET;
  form.target = FORMSUBMIT_IFRAME_NAME;
  form.style.display = 'none';

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);

  let settled = false;
  const cleanup = () => {
    if (settled) {
      return;
    }
    settled = true;
    iframe?.removeEventListener('load', onLoad);
    if (document.body.contains(form)) {
      document.body.removeChild(form);
    }
    resolve();
  };

  const onLoad = () => {
    window.setTimeout(cleanup, 150);
  };

  iframe.addEventListener('load', onLoad, { once: true });
  form.submit();
  window.setTimeout(cleanup, 12000);
  });
};

const sendLeadConfirmationEmail = async (leadEmail: string, teamName: string) => {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error('EMAILJS_NOT_CONFIGURED');
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: leadEmail,
        team_name: teamName,
        message: CONFIRMATION_MESSAGE,
        reply_to: ORGANIZER_EMAIL,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`EMAILJS_SEND_FAILED: ${details || response.statusText}`);
  }
};

const initialData: FormData = {
  teamName: "",
  collegeName: "",
  teamSize: "4",
  leaderName: "",
  leaderUSN: "",
  leaderYear: "1",
  leaderPhone: "",
  email: "",
  members: [
    { name: "", usn: "" },
    { name: "", usn: "" },
    { name: "", usn: "" }
  ],
  problemStatement: "",
  paymentUtr: "",
};

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const nextStep = () => {
    if (step === 1) {
      if (!formData.teamName.trim() || !formData.collegeName.trim()) {
        setErrorMsg("Error: You must provide your Team Name and College Name.");
        return;
      }
    }
    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setErrorMsg("Error: Please enter a valid real email address.");
        return;
      }
      if (!/^\d{10}$/.test(formData.leaderPhone.trim())) {
        setErrorMsg("Error: Phone number must be exactly 10 digits long (no letters or spaces).");
        return;
      }
      if (!formData.leaderName.trim() || !formData.leaderUSN.trim()) {
        setErrorMsg("Error: Leader Name and USN cannot be empty.");
        return;
      }
    }

    setErrorMsg("");
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index: number, field: 'name' | 'usn', value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const submitForm = async () => {
    if (!/^\d{12}$/.test(formData.paymentUtr.trim())) {
      setErrorMsg("Error: The UPI Transaction Reference (UTR) number must be EXACTLY 12 DIGITS. Please review your transaction and enter the correct 12-digit number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const leadEmail = formData.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(leadEmail)) {
        setErrorMsg("Error: Please enter a valid real email address.");
        setIsSubmitting(false);
        return;
      }
      const requiredMembers = formData.members.slice(0, parseInt(formData.teamSize) - 1);

      // Always submit registration details to organizer inbox.
      await submitViaHiddenForm({
        "Team Name": formData.teamName,
        "College Name": formData.collegeName,
        "Team Size": formData.teamSize,
        "Leader Name": formData.leaderName,
        "Leader USN": formData.leaderUSN,
        "Leader Year": formData.leaderYear,
        "Leader Phone": formData.leaderPhone,
        "Leader Email": leadEmail,
        "Problem Statement": formData.problemStatement,
        "Payment UTR": formData.paymentUtr,
        "Members (JSON)": JSON.stringify(requiredMembers),
        _subject: `New Hackathon Registration: ${formData.teamName}`,
        email: ORGANIZER_EMAIL,
        _replyto: ORGANIZER_EMAIL,
        _template: "table",
      });

      try {
        await sendLeadConfirmationEmail(leadEmail, formData.teamName);
        setSuccessMsg(`Registration details sent to ${ORGANIZER_EMAIL}. Team lead confirmation sent to ${leadEmail}.`);
      } catch (mailErr) {
        if (mailErr instanceof Error && mailErr.message === 'EMAILJS_NOT_CONFIGURED') {
          setSuccessMsg(`Registration details sent to ${ORGANIZER_EMAIL}. Team-lead confirmation mail is not configured yet.`);
        } else {
          const details = mailErr instanceof Error ? mailErr.message : 'Unknown EmailJS error';
          setSuccessMsg(`Registration details sent to ${ORGANIZER_EMAIL}. Team-lead confirmation failed: ${details}`);
        }
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMsg("Something went wrong while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 5;

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={{ textAlign: 'center', padding: '40px 20px' }}
      >
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', margin: '0 auto 24px' }}>
          <CheckCircle2 size={40} color="var(--accent-primary)" style={{ margin: 'auto' }} />
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }} className="text-gradient">Submission Successful!</h2>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px' }}>
          <p>Your team <strong>{formData.teamName}</strong> has been registered for Adhi Tantra. We can't wait to see your innovation!</p>
          {successMsg && <p style={{ marginTop: '12px', fontSize: '0.96rem' }}>{successMsg}</p>}
        </div>
        <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '30px', borderRadius: '24px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <p style={{ fontWeight: 600, marginBottom: '20px', fontSize: '1.1rem' }}>Final Step: Join the Hackathon Hub</p>
          <a href="https://chat.whatsapp.com/E8R4FAomu9JDi40rIrv9DR?mode=gi_t" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '16px 32px', borderRadius: '50px' }}>
            <Phone size={20} /> Join WhatsApp Group
          </a>
        </div>
      </motion.div>
    );
  }

  const memberCount = parseInt(formData.teamSize) - 1;

  return (
    <div className="form-stable-container" style={{ position: 'relative' }}>
      {/* Step Indicators */}
      <div className="steps-indicator">
        {[...Array(totalSteps)].map((_, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <div 
              key={stepNum} 
              className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              {isCompleted ? <Check size={18} /> : stepNum}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {errorMsg && <div className="alert-error form-error">{errorMsg}</div>}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="step-title">
                <Trophy color="var(--accent-primary)" /> Team Overview
              </h2>
              <div className="form-group">
                <label className="form-label">Team Name *</label>
                <input type="text" name="teamName" className="form-input" placeholder="e.g. Innovators" value={formData.teamName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">College Name *</label>
                <input type="text" name="collegeName" className="form-input" placeholder="e.g. BGSIT" value={formData.collegeName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Team Size</label>
                <select name="teamSize" className="form-input form-select" value={formData.teamSize} onChange={handleChange}>
                  <option value="4">4 Members (Full Team)</option>
                  <option value="3">3 Members</option>
                  <option value="2">2 Members (Duo)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Leader Info */}
          {step === 2 && (
            <div>
              <h2 className="step-title">
                <User color="var(--accent-primary)" /> Team Leader Details
              </h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Leader Name *</label>
                  <input type="text" name="leaderName" className="form-input" value={formData.leaderName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Leader USN *</label>
                  <input type="text" name="leaderUSN" className="form-input" value={formData.leaderUSN} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Year of Study *</label>
                  <select name="leaderYear" className="form-input form-select" value={formData.leaderYear} onChange={handleChange}>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number (10 digits) *</label>
                  <input type="tel" name="leaderPhone" className="form-input" value={formData.leaderPhone} onChange={handleChange} required placeholder="e.g. 9876543210" maxLength={10} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required placeholder="e.g. name@example.com" />
              </div>
            </div>
          )}

          {/* STEP 3: Other Members */}
          {step === 3 && (
            <div>
              <h2 className="step-title">
                <Users color="var(--accent-primary)" /> Team Members
              </h2>
              <p className="step-description">
                Please provide details for the remaining {memberCount} member(s).
              </p>
              
              {[...Array(memberCount)].map((_, i) => (
                <div key={i} className="member-card">
                  <h4 className="member-card-title">Member {i + 1}</h4>
                  <div className="form-row">
                    <div className="form-group compact-group">
                      <label className="form-label">Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.members[i].name} 
                        onChange={(e) => handleMemberChange(i, 'name', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group compact-group">
                      <label className="form-label">USN</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.members[i].usn} 
                        onChange={(e) => handleMemberChange(i, 'usn', e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: Problem Statement */}
          {step === 4 && (
            <div>
              <h2 className="step-title">
                <BookOpen color="var(--accent-primary)" /> Problem Statement
              </h2>
              <p className="step-description">
                Select the track your team will be hacking on.
              </p>
              <div className="form-group">
                {PROBLEM_STATEMENTS.map((ps, idx) => (
                  <label 
                    key={idx} 
                    className={`statement-option ${formData.problemStatement === ps ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="problemStatement" 
                      value={ps} 
                      checked={formData.problemStatement === ps}
                      onChange={handleChange}
                      className="statement-radio"
                    />
                    <span className={`statement-text ${formData.problemStatement === ps ? 'selected' : ''}`}>{ps}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Payment Details */}
          {step === 5 && (
            <div>
              <h2 className="step-title">
                <CreditCard color="var(--accent-primary)" /> Registration Fee
              </h2>
              
              <div className="payment-summary">
                <h3 className="payment-summary-title">Total Amount Due</h3>
                <div className="text-gradient payment-amount">
                  ₹500
                </div>
                <p className="payment-summary-note">Flat rate per team</p>
              </div>

              <div className="payment-panel">
                <h4 className="payment-panel-title">
                  <Phone size={18} /> UPI Payment
                </h4>
                <div className="qr-wrap">
                  <img 
                    src="/scanner.jpg" 
                    alt="Payment QR Scanner" 
                    className="qr-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Scanner+Photo+Here';
                    }}
                  />
                </div>
                <p className="upi-name">Navya Shree</p>
                <p className="upi-id">28navyashree@oksbi</p>
              </div>

              <div className="form-group">
                <label className="form-label">UPI Transaction Reference Number *</label>
                <input 
                  type="text" 
                  name="paymentUtr"
                  className="form-input" 
                  placeholder="e.g. 123456789012" 
                  value={formData.paymentUtr}
                  onChange={handleChange}
                  maxLength={12}
                  required 
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="form-actions">
        <button 
          className="btn btn-secondary" 
          onClick={prevStep}
          style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          disabled={isSubmitting}
        >
          <ChevronLeft size={20} /> Back
        </button>

        {step < totalSteps ? (
          <button className="btn btn-primary" onClick={nextStep}>
            Next Step <ChevronRight size={20} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Complete & Register'} <Check size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
