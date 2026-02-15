'use client';

import { useEffect, useState, useRef } from 'react';

type TextSize = '100' | '110' | '120' | '130' | '140';
type DisplayMode = 'default' | 'high-dark' | 'high-light';
type LineHeight = 'normal' | 'comfortable';
type LetterSpacing = 'normal' | 'wide';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>('100');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('default');
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [lineHeight, setLineHeight] = useState<LineHeight>('normal');
  const [letterSpacing, setLetterSpacing] = useState<LetterSpacing>('normal');
  const [readableFont, setReadableFont] = useState(false);
  const [enhancedFocus, setEnhancedFocus] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTextSize = localStorage.getItem('textSize') as TextSize;
    const savedDisplayMode = localStorage.getItem('displayMode') as DisplayMode;
    const savedUnderlineLinks = localStorage.getItem('underlineLinks') === 'true';
    const savedHighlightLinks = localStorage.getItem('highlightLinks') === 'true';
    const savedLineHeight = localStorage.getItem('lineHeight') as LineHeight;
    const savedLetterSpacing = localStorage.getItem('letterSpacing') as LetterSpacing;
    const savedReadableFont = localStorage.getItem('readableFont') === 'true';
    const savedEnhancedFocus = localStorage.getItem('enhancedFocus') === 'true';
    const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';
    
    if (savedTextSize) setTextSize(savedTextSize);
    if (savedDisplayMode) setDisplayMode(savedDisplayMode);
    if (savedUnderlineLinks !== null) setUnderlineLinks(savedUnderlineLinks);
    if (savedHighlightLinks !== null) setHighlightLinks(savedHighlightLinks);
    if (savedLineHeight) setLineHeight(savedLineHeight);
    if (savedLetterSpacing) setLetterSpacing(savedLetterSpacing);
    if (savedReadableFont !== null) setReadableFont(savedReadableFont);
    if (savedEnhancedFocus !== null) setEnhancedFocus(savedEnhancedFocus);
    if (savedReduceMotion !== null) setReduceMotion(savedReduceMotion);
  }, []);

  // Apply text size changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-text-size', textSize);
    localStorage.setItem('textSize', textSize);
  }, [textSize]);

  // Apply display mode changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-display-mode', displayMode);
    localStorage.setItem('displayMode', displayMode);
  }, [displayMode]);

  // Apply underline links changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-underline-links', String(underlineLinks));
    localStorage.setItem('underlineLinks', String(underlineLinks));
  }, [underlineLinks]);

  // Apply highlight links changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-highlight-links', String(highlightLinks));
    localStorage.setItem('highlightLinks', String(highlightLinks));
  }, [highlightLinks]);

  // Apply line height changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-line-height', lineHeight);
    localStorage.setItem('lineHeight', lineHeight);
  }, [lineHeight]);

  // Apply letter spacing changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-letter-spacing', letterSpacing);
    localStorage.setItem('letterSpacing', letterSpacing);
  }, [letterSpacing]);

  // Apply readable font changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-readable-font', String(readableFont));
    localStorage.setItem('readableFont', String(readableFont));
  }, [readableFont]);

  // Apply enhanced focus changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-enhanced-focus', String(enhancedFocus));
    localStorage.setItem('enhancedFocus', String(enhancedFocus));
  }, [enhancedFocus]);

  // Apply reduce motion changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-reduce-motion', String(reduceMotion));
    localStorage.setItem('reduceMotion', String(reduceMotion));
  }, [reduceMotion]);

  // Keyboard navigation: Escape to close, focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }

      // Focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const textSizeSteps: TextSize[] = ['100', '110', '120', '130', '140'];
  
  const increaseTextSize = () => {
    const currentIndex = textSizeSteps.indexOf(textSize);
    if (currentIndex < textSizeSteps.length - 1) {
      setTextSize(textSizeSteps[currentIndex + 1]);
    }
  };

  const decreaseTextSize = () => {
    const currentIndex = textSizeSteps.indexOf(textSize);
    if (currentIndex > 0) {
      setTextSize(textSizeSteps[currentIndex - 1]);
    }
  };

  const resetSettings = () => {
    setTextSize('100');
    setDisplayMode('default');
    setUnderlineLinks(false);
    setHighlightLinks(false);
    setLineHeight('normal');
    setLetterSpacing('normal');
    setReadableFont(false);
    setEnhancedFocus(false);
    setReduceMotion(false);
  };

  return (
    <>
      {/* Accessibility Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Open accessibility options"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            ref={panelRef}
            className="fixed right-4 top-36 z-50 w-80 max-h-[calc(100vh-10rem)] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
            role="dialog"
            aria-label="Accessibility options"
            aria-modal="true"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">Accessibility</h2>
                <p className="text-xs text-muted">These settings are saved on this device.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close accessibility settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Text Size Controls */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-text">
                  Text Size
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseTextSize}
                    disabled={textSize === '100'}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Decrease text size"
                  >
                    <span className="text-xl font-bold" aria-hidden="true">A-</span>
                  </button>
                  <div className="flex-1 text-center text-sm font-semibold text-muted">
                    {textSize}%
                  </div>
                  <button
                    onClick={increaseTextSize}
                    disabled={textSize === '140'}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Increase text size"
                  >
                    <span className="text-xl font-bold" aria-hidden="true">A+</span>
                  </button>
                </div>
              </div>

              {/* Display Mode Selector */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-text">
                  Display Mode
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setDisplayMode('default')}
                    className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                      displayMode === 'default'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                    aria-pressed={displayMode === 'default'}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => setDisplayMode('high-dark')}
                    className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                      displayMode === 'high-dark'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                    aria-pressed={displayMode === 'high-dark'}
                  >
                    High Contrast (Dark)
                  </button>
                  <button
                    onClick={() => setDisplayMode('high-light')}
                    className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                      displayMode === 'high-light'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                    aria-pressed={displayMode === 'high-light'}
                  >
                    High Contrast (Light)
                  </button>
                </div>
              </div>

              {/* Link Visibility Toggles */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-text">
                  Link Visibility
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setUnderlineLinks(!underlineLinks)}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                      underlineLinks
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                    role="switch"
                    aria-checked={underlineLinks}
                    aria-label="Toggle underline links"
                  >
                    <div className="flex items-center justify-between">
                      <span>Underline All Links</span>
                      <div
                        className={`h-6 w-11 rounded-full transition ${
                          underlineLinks ? 'bg-primary' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                            underlineLinks ? 'translate-x-6' : 'translate-x-0.5'
                          } mt-0.5`}
                        />
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setHighlightLinks(!highlightLinks)}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                      highlightLinks
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                    role="switch"
                    aria-checked={highlightLinks}
                    aria-label="Toggle highlight links"
                  >
                    <div className="flex items-center justify-between">
                      <span>Highlight Links</span>
                      <div
                        className={`h-6 w-11 rounded-full transition ${
                          highlightLinks ? 'bg-primary' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                            highlightLinks ? 'translate-x-6' : 'translate-x-0.5'
                          } mt-0.5`}
                        />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Line Height Toggle */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-text">
                  Spacing
                </label>
                <button
                  onClick={() => setLineHeight(lineHeight === 'normal' ? 'comfortable' : 'normal')}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    lineHeight === 'comfortable'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                  role="switch"
                  aria-checked={lineHeight === 'comfortable'}
                  aria-label="Toggle comfortable line height"
                >
                  <div className="flex items-center justify-between">
                    <span>Comfortable Line Height</span>
                    <div
                      className={`h-6 w-11 rounded-full transition ${
                        lineHeight === 'comfortable' ? 'bg-primary' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          lineHeight === 'comfortable' ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </button>
              </div>

              {/* Letter Spacing Toggle */}
              <div>
                <button
                  onClick={() => setLetterSpacing(letterSpacing === 'normal' ? 'wide' : 'normal')}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    letterSpacing === 'wide'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                  role="switch"
                  aria-checked={letterSpacing === 'wide'}
                  aria-label="Toggle wide letter spacing"
                >
                  <div className="flex items-center justify-between">
                    <span>Wide Letter Spacing</span>
                    <div
                      className={`h-6 w-11 rounded-full transition ${
                        letterSpacing === 'wide' ? 'bg-primary' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          letterSpacing === 'wide' ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </button>
              </div>

              {/* Readable Font Toggle */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-text">
                  Typography
                </label>
                <button
                  onClick={() => setReadableFont(!readableFont)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    readableFont
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                  role="switch"
                  aria-checked={readableFont}
                  aria-label="Toggle readable font"
                >
                  <div className="flex items-center justify-between">
                    <span>Readable Font</span>
                    <div
                      className={`h-6 w-11 rounded-full transition ${
                        readableFont ? 'bg-primary' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          readableFont ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </button>
              </div>

              {/* Reduce Motion Toggle */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-text">
                  Motion
                </label>
                <button
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    reduceMotion
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                  role="switch"
                  aria-checked={reduceMotion}
                  aria-label="Toggle reduce motion"
                >
                  <div className="flex items-center justify-between">
                    <span>Reduce Motion</span>
                    <div
                      className={`h-6 w-11 rounded-full transition ${
                        reduceMotion ? 'bg-primary' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          reduceMotion ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </button>
              </div>

              {/* Enhanced Focus Indicators Toggle */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-text">
                  Keyboard Navigation
                </label>
                <button
                  onClick={() => setEnhancedFocus(!enhancedFocus)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                    enhancedFocus
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                  role="switch"
                  aria-checked={enhancedFocus}
                  aria-label="Toggle enhanced focus indicators"
                >
                  <div className="flex items-center justify-between">
                    <span>Enhanced Focus Indicators</span>
                    <div
                      className={`h-6 w-11 rounded-full transition ${
                        enhancedFocus ? 'bg-primary' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          enhancedFocus ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </button>
              </div>

              {/* Reset Button */}
              <div className="pt-2">
                <button
                  onClick={resetSettings}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-text transition hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Reset to Defaults
                </button>
              </div>

              {/* Keyboard Shortcuts Info */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Keyboard Shortcuts
                </h3>
                <ul className="space-y-1 text-xs text-muted">
                  <li><kbd className="rounded bg-white dark:bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Tab</kbd> Navigate forward</li>
                  <li><kbd className="rounded bg-white dark:bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Shift + Tab</kbd> Navigate backward</li>
                  <li><kbd className="rounded bg-white dark:bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Enter</kbd> Activate link/button</li>
                  <li><kbd className="rounded bg-white dark:bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Esc</kbd> Close this panel</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
