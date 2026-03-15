import { useState } from 'react';
import { usePhoneAuth } from '../hooks/usePhoneAuth';

/**
 * PhoneVerification — reusable OTP verification component
 *
 * Props:
 *   onVerified(phoneNumber) — called when OTP confirmed successfully
 *   initialPhone            — pre-fill phone input
 *   onPhoneChange(phone)    — called when user types in phone field (optional)
 */
export default function PhoneVerification({ onVerified, initialPhone = '', onPhoneChange }) {
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const { step, error, cooldown, sendOTP, verifyOTP } = usePhoneAuth(onVerified);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (onPhoneChange) onPhoneChange(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendOTP(phone);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    verifyOTP(otp, phone);
  };

  const isVerified = step === 'verified';
  const isSending = step === 'sending';
  const isSent = step === 'sent' || step === 'verifying';

  return (
    <div className="space-y-3">
      {/* Invisible reCAPTCHA anchor */}
      <div id="recaptcha-container" />

      {/* Phone input row */}
      <div className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          disabled={isVerified || isSent}
          placeholder="+91XXXXXXXXXX"
          className="input-field flex-1"
        />
        {!isVerified && (
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || (isSent && cooldown > 0) || isVerified}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '12px',
              padding: '0 16px',
              fontSize: '13px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              opacity: (isSending || (isSent && cooldown > 0)) ? 0.6 : 1,
              cursor: (isSending || (isSent && cooldown > 0)) ? 'not-allowed' : 'pointer',
              border: 'none',
              minWidth: '100px',
            }}
          >
            {isSending
              ? 'Check below ↓'
              : isSent && cooldown > 0
              ? `Resend (${cooldown}s)`
              : isSent
              ? 'Resend OTP'
              : 'Send OTP'}
          </button>
        )}
      </div>

      {/* OTP input — shown after sending */}
      {isSent && !isVerified && (
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit OTP"
            className="input-field flex-1 tracking-widest text-center font-bold"
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={step === 'verifying' || otp.length !== 6}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '12px',
              padding: '0 16px',
              fontSize: '13px',
              fontWeight: 700,
              opacity: (step === 'verifying' || otp.length !== 6) ? 0.6 : 1,
              cursor: (step === 'verifying' || otp.length !== 6) ? 'not-allowed' : 'pointer',
              border: 'none',
              minWidth: '100px',
            }}
          >
            {step === 'verifying' ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {/* Verified badge */}
      {isVerified && (
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--primary)' }}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: 'var(--primary)' }}>✓</span>
          Phone Verified
        </div>
      )}

      {/* reCAPTCHA solving hint */}
      {isSending && (
        <p className="text-xs text-gray-500">Complete the reCAPTCHA below, then OTP will be sent automatically.</p>
      )}

      {/* OTP sent hint */}
      {isSent && !isVerified && (
        <p className="text-xs text-gray-500">OTP sent to {phone}. Check your messages.</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
