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
  leaderEmail: string;
  members: { name: string; usn: string }[];
  problemStatement: string;
  paymentUtr: string;
};

const initialData: FormData = {
  teamName: "",
  collegeName: "",
  teamSize: "4",
  leaderName: "",
  leaderUSN: "",
  leaderYear: "1",
  leaderPhone: "",
  leaderEmail: "",
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

  const nextStep = () => {
    if (step === 1) {
      if (!formData.teamName.trim() || !formData.collegeName.trim()) {
        setErrorMsg("Error: You must provide your Team Name and College Name.");
        return;
      }
    }
    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.leaderEmail.trim())) {
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
      const requiredMembers = formData.members.slice(0, parseInt(formData.teamSize) - 1);
      
      const payload = {
        ...formData,
        members: JSON.stringify(requiredMembers)
      };

      const res = await fetch("https://formsubmit.co/ajax/adhitantra786@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `New Hackathon Registration: ${formData.teamName}`,
          ...payload
        })
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to submit form.");
      }
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', padding: '40px 20px' }}
      >
        <CheckCircle2 size={80} color="var(--accent-primary)" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Registration Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Welcome to Adhi Tantra. Your details have been sent to our team.
        </p>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '20px', borderRadius: '16px', display: 'inline-block' }}>
          <p style={{ fontWeight: 600, marginBottom: '10px' }}>Next Step: Join our WhatsApp Group for updates</p>
          <a href="https://chat.whatsapp.com/E8R4FAomu9JDi40rIrv9DR?mode=gi_t" target="_blank" rel="noreferrer" className="btn btn-primary">
            Join WhatsApp Group
          </a>
        </div>
      </motion.div>
    );
  }

  const memberCount = parseInt(formData.teamSize) - 1;

  return (
    <div style={{ position: 'relative' }}>
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
          {errorMsg && <div className="alert-error" style={{marginBottom: 20}}>{errorMsg}</div>}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '1.5rem' }}>
                <Trophy color="var(--accent-primary)" /> Team Overview
              </h2>
              <div className="form-group">
                <label className="form-label">Team Name *</label>
                <input type="text" name="teamName" className="form-input" placeholder="e.g. Innovators" value={formData.teamName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">College Name *</label>
                <input type="text" name="collegeName" className="form-input" placeholder="e.g. Adhitantra Institute" value={formData.collegeName} onChange={handleChange} required />
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
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '1.5rem' }}>
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
                <input type="email" name="leaderEmail" className="form-input" value={formData.leaderEmail} onChange={handleChange} required placeholder="e.g. name@example.com" />
              </div>
            </div>
          )}

          {/* STEP 3: Other Members */}
          {step === 3 && (
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '1.5rem' }}>
                <Users color="var(--accent-primary)" /> Team Members
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                Please provide details for the remaining {memberCount} member(s).
              </p>
              
              {[...Array(memberCount)].map((_, i) => (
                <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--glass-border)' }}>
                  <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Member {i + 1}</h4>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.members[i].name} 
                        onChange={(e) => handleMemberChange(i, 'name', e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
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
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '1.5rem' }}>
                <BookOpen color="var(--accent-primary)" /> Problem Statement
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Select the track your team will be hacking on.
              </p>
              <div className="form-group">
                {PROBLEM_STATEMENTS.map((ps, idx) => (
                  <label 
                    key={idx} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '16px', 
                      background: formData.problemStatement === ps ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-glass)',
                      border: `1px solid ${formData.problemStatement === ps ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginBottom: '10px'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="problemStatement" 
                      value={ps} 
                      checked={formData.problemStatement === ps}
                      onChange={handleChange}
                      style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: formData.problemStatement === ps ? 600 : 400 }}>{ps}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Payment Details */}
          {step === 5 && (
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '1.5rem' }}>
                <CreditCard color="var(--accent-primary)" /> Registration Fee
              </h2>
              
              <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '30px', borderRadius: '16px', textAlign: 'center', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Total Amount Due</h3>
                <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '10px' }} className="text-gradient">
                  ₹500
                </div>
                <p style={{ color: 'var(--text-muted)' }}>Flat rate per team</p>
              </div>

              <div style={{ padding: '20px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '30px' }}>
                <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={18} /> UPI Payment
                </h4>
                <div style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}>
                  <img 
                    src="/scanner.jpg" 
                    alt="Payment QR Scanner" 
                    style={{ width: '200px', height: 'auto', borderRadius: '8px' }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Scanner+Photo+Here';
                    }}
                  />
                </div>
                <p style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>Navya Shree</p>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>28navyashree@oksbi</p>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
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
