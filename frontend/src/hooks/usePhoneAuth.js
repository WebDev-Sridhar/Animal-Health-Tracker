import { useState, useRef, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/firebase';

// step: 'idle' | 'sending' | 'sent' | 'verifying' | 'verified'
export function usePhoneAuth(onVerified) {
  const [step, setStep] = useState('idle');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);
  const cooldownTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch (_) {}
      }
    };
  }, []);

  const startCooldown = (seconds = 30) => {
    setCooldown(seconds);
    cooldownTimerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOTP = async (phoneNumber) => {
    setError('');
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setError('Please enter a valid phone number with country code (e.g. +91XXXXXXXXXX)');
      return;
    }

    try {
      setStep('sending');

      // Clear any existing recaptcha instance and wipe the container
      if (recaptchaRef.current) {
        try { recaptchaRef.current.clear(); } catch (_) {}
        recaptchaRef.current = null;
      }
      const container = document.getElementById('recaptcha-container');
      if (container) container.innerHTML = '';

      // Use normal (visible) reCAPTCHA — more reliable without Enterprise
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: async (token) => {
          // reCAPTCHA solved — now send OTP
          try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaRef.current);
            confirmationRef.current = result;
            setStep('sent');
            startCooldown(30);
          } catch (err) {
            setStep('idle');
            setError(mapFirebaseError(err.code));
          }
        },
        'expired-callback': () => {
          setStep('idle');
          setError('reCAPTCHA expired. Please try again.');
        },
      });

      await recaptchaRef.current.render();
      // Step changes to 'sending' — UI shows the reCAPTCHA checkbox
      // User checks the box → callback fires → OTP is sent
    } catch (err) {
      setStep('idle');
      recaptchaRef.current = null;
      setError(mapFirebaseError(err.code));
    }
  };

  const verifyOTP = async (code, phoneNumber) => {
    setError('');
    if (!code || code.trim().length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    if (!confirmationRef.current) {
      setError('Session expired. Please request a new OTP.');
      setStep('idle');
      return;
    }

    try {
      setStep('verifying');
      await confirmationRef.current.confirm(code);
      setStep('verified');
      if (onVerified) onVerified(phoneNumber);
    } catch (err) {
      setStep('sent');
      setError(mapFirebaseError(err.code));
    }
  };

  const reset = () => {
    setStep('idle');
    setError('');
    setCooldown(0);
    confirmationRef.current = null;
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    if (recaptchaRef.current) {
      try { recaptchaRef.current.clear(); } catch (_) {}
      recaptchaRef.current = null;
    }
  };

  return { step, error, cooldown, sendOTP, verifyOTP, reset };
}

function mapFirebaseError(code) {
  const map = {
    'auth/invalid-phone-number': 'Invalid phone number. Use format: +91XXXXXXXXXX',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
    'auth/code-expired': 'OTP has expired. Please request a new one.',
    'auth/invalid-verification-code': 'Incorrect OTP. Please check and try again.',
    'auth/missing-phone-number': 'Phone number is required.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
