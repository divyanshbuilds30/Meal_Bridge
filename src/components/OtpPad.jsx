import React, { useState } from 'react';

export function OtpPad({ length = 4, onSubmit, title = "Enter Verification OTP" }) {
  const [digits, setDigits] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDigit = (d) => {
    if (digits.length < length && !isError) {
      const next = digits + d;
      setDigits(next);
      if (next.length === length) {
        handleSubmit(next);
      }
    }
  };

  const handleBackspace = () => {
    if (!isError) {
      setDigits((prev) => prev.slice(0, -1));
      setErrorMessage("");
    }
  };

  const handleSubmit = (codeToVerify) => {
    const code = codeToVerify || digits;
    if (code.length < length) return;

    const success = onSubmit(code);
    if (!success) {
      setIsError(true);
      setErrorMessage("Incorrect OTP. Please check with the partner.");
      setTimeout(() => {
        setDigits("");
        setIsError(false);
      }, 700);
    } else {
      setDigits("");
      setErrorMessage("");
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center">
      {title && <p className="text-sm font-semibold text-slate-700 mb-3">{title}</p>}

      {/* Digit boxes */}
      <div className={`flex gap-3 mb-4 ${isError ? 'animate-shake' : ''}`}>
        {Array.from({ length }).map((_, i) => {
          const char = digits[i] || "";
          return (
            <div
              key={i}
              className={`w-12 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold font-heading border-2 transition-all ${
                isError
                  ? "border-critical bg-red-50 text-critical"
                  : char
                  ? "border-brand-600 bg-brand-50/50 text-ink shadow-sm"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              {char}
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <p className="text-xs font-semibold text-critical mb-3 text-center">{errorMessage}</p>
      )}

      {/* 3x4 Keypad */}
      <div className="grid grid-cols-3 gap-2.5 w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleDigit(n)}
            className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-xl font-semibold text-ink font-heading transition-all"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={handleBackspace}
          className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-lg font-semibold text-slate-600 transition-all flex items-center justify-center"
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-xl font-semibold text-ink font-heading transition-all"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={digits.length < length}
          className="h-12 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 active:scale-95 text-lg font-bold text-white transition-all flex items-center justify-center"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
