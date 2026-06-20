'use client';
import { useState, useEffect } from 'react';

const footerLinks = [
  { label: 'Get started', href: '/quickstart' },
  { label: 'Documentation', href: '/' },
  { label: 'API Reference', href: '/api-reference' },
  { label: 'Support', href: 'mailto:support@moydus.com' },
  { label: 'Website', href: 'https://moydus.com', external: true },
  { label: 'llms.txt', href: '/llms.txt', external: true },
  { label: 'llms-full.txt', href: '/llms-full.txt', external: true },
];

const socials = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/moydus',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/moydus',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/moydus',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

type Theme = 'light' | 'dark' | 'system';

function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    setTheme(saved ?? 'system');
  }, []);

  const apply = (t: Theme) => {
    setTheme(t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (t === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  };

  const base = 'p-1.5 rounded-lg transition-colors';
  const active = 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  const inactive = 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400';

  return (
    <div className="flex items-center gap-1">
      <button aria-label="System theme" onClick={() => apply('system')} className={`${base} ${theme === 'system' ? active : inactive}`}>
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.111 14.444C5.785 14.232 6.781 14 8 14c.707 0 1.726.078 2.889.444M8 11.778V14M12.667 2.444H3.333A1.778 1.778 0 001.556 4.222V10A1.778 1.778 0 003.333 11.778h9.334A1.778 1.778 0 0014.444 10V4.222a1.778 1.778 0 00-1.777-1.778z" />
        </svg>
      </button>
      <button aria-label="Light theme" onClick={() => apply('light')} className={`${base} ${theme === 'light' ? active : inactive}`}>
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 1.111V2M12.871 3.129l-.628.628M14.889 8H14M12.871 12.871l-.628-.628M8 14.889V14M3.129 12.871l.628-.628M1.111 8H2M3.129 3.129l.628.628M8 5.333a2.667 2.667 0 100 5.334A2.667 2.667 0 008 5.333z" />
        </svg>
      </button>
      <button aria-label="Dark theme" onClick={() => apply('dark')} className={`${base} ${theme === 'dark' ? active : inactive}`}>
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer id="footer" className="flex flex-col items-center mx-auto border-t border-gray-100 dark:border-gray-800/50 w-full">
      <div className="flex w-full flex-col gap-12 justify-between px-3 py-16 md:py-20 lg:py-28 max-w-[984px]">

        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-8 justify-between">

          {/* Logo + mobile socials */}
          <div className="flex md:flex-col justify-between items-center md:items-start min-w-16 md:min-w-20 lg:min-w-48 md:gap-y-24">
            <a href="/" className="select-none flex items-center gap-2">
              <span className="sr-only">Moydus home page</span>
              <img className="w-auto object-contain block dark:hidden h-[26px]" alt="Moydus" src="/logo/light.svg" />
              <img className="w-auto object-contain hidden dark:block h-[26px]" alt="Moydus" src="/logo/dark.svg" />
              <span className="font-semibold text-gray-900 dark:text-white text-[15px] tracking-tight">Moydus</span>
            </a>
            <div className="flex gap-4 flex-wrap h-fit md:hidden justify-end">
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="h-fit text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors">
                  <span className="sr-only">{s.label}</span>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Center links */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex gap-4 flex-col md:flex-row md:items-center md:gap-8 md:justify-center flex-wrap">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  className="text-sm whitespace-normal md:truncate text-gray-950/50 dark:text-white/50 hover:text-gray-950/70 dark:hover:text-white/70 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials — desktop */}
          <div className="gap-4 flex-wrap hidden md:flex justify-end items-start">
            {socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="h-fit text-gray-500 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors">
                <span className="sr-only">{s.label}</span>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 dark:bg-white/5" />

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="sm:flex">
            <a
              href="https://docfiy.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline gap-1 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <span>Powered by</span>
              <span className="font-semibold tracking-tight">Docfiy</span>
            </a>
          </div>
          <ThemeSwitcher />
        </div>

      </div>
    </footer>
  );
}
