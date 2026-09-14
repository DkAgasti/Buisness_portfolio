'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const ADMIN_EMAIL = 'workwithcodepro@gmail.com';

export default function ForgotPassword() {
  const [step, setStep] = useState('otp'); // otp | reset | done
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Auto-send OTP on page load
  useEffect(() => {
    fetch(`${API}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL }),
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to send OTP');
        return r.json();
      })
      .then(() => toast.success('OTP sent to your email!'))
      .catch(err => toast.error(err.message || 'Failed to send OTP'))
      .finally(() => setSending(false));
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, otp }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Invalid OTP');
      }
      toast.success('OTP verified!');
      setStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, otp, new_password: newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to reset password');
      }
      toast.success('Password updated successfully!');
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setSending(true);
    setError('');
    setOtp('');
    try {
      await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL }),
      });
      toast.success('New OTP sent!');
    } catch { toast.error('Failed to resend'); }
    finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              {step === 'done' ? <CheckCircle className="w-7 h-7 text-white" /> : <KeyRound className="w-7 h-7 text-white" />}
            </div>
            <h1 className="text-2xl font-bold font-heading">
              {step === 'otp' && 'Enter OTP'}
              {step === 'reset' && 'New Password'}
              {step === 'done' && 'Password Updated'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {step === 'otp' && (sending ? 'Sending OTP to your email...' : 'Enter the 6-digit code sent to your email')}
              {step === 'reset' && 'Create your new password'}
              {step === 'done' && 'Your password has been updated successfully'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>
          )}

          {/* Step 1: OTP only */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">OTP Code</label>
                <input
                  type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} required
                  maxLength={6} inputMode="numeric" autoFocus
                  className="w-full px-3 py-3 rounded-lg bg-gray-50 dark:bg-muted/60 border border-gray-200 dark:border-border text-foreground text-center text-xl font-bold tracking-[8px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="000000"
                />
                <button type="button" onClick={resendOtp} disabled={sending}
                  className="text-xs text-primary hover:text-primary/80 mt-2 transition-colors disabled:opacity-50">
                  {sending ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Verify OTP'}
              </button>
            </form>
          )}

          {/* Step 2: Change password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 dark:bg-muted/60 border border-gray-200 dark:border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Min 6 characters" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 dark:bg-muted/60 border border-gray-200 dark:border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Repeat password" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
              </button>
            </form>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-muted-foreground mb-6">You can now login with your new password</p>
              <button onClick={() => router.push('/admin/login')}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-sm transition-colors">
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
