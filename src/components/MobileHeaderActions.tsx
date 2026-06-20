import { useState } from 'react';
import { Icon } from '@mintlify/components';
import { openSearch } from './SearchBar';
import { toggleAssistant } from './Assistant/events';

const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className="size-4.5 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
  >
    <path
      d="M5.65799 2.99L4.39499 2.569L3.97399 1.306C3.83699 0.898 3.16199 0.898 3.02499 1.306L2.60399 2.569L1.34099 2.99C1.13699 3.058 0.998993 3.249 0.998993 3.464C0.998993 3.679 1.13699 3.87 1.34099 3.938L2.60399 4.359L3.02499 5.622C3.09299 5.826 3.28499 5.964 3.49999 5.964C3.71499 5.964 3.90599 5.826 3.97499 5.622L4.39599 4.359L5.65899 3.938C5.86299 3.87 6.00099 3.679 6.00099 3.464C6.00099 3.249 5.86199 3.058 5.65799 2.99Z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M9.5 2.75L11.412 7.587L16.25 9.5L11.412 11.413L9.5 16.25L7.587 11.413L2.75 9.5L7.587 7.587L9.5 2.75Z" />
  </svg>
);

const navLinks = [
  { label: 'Support', href: 'mailto:support@moydus.com' },
  { label: 'Get started', href: 'https://moydus.com', external: true },
];

function MobileEllipsisMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="More actions"
        onClick={() => setOpen((v) => !v)}
        className="h-7 w-5 flex items-center justify-center relative after:content-[''] after:absolute after:-inset-y-2 after:-left-1 after:-right-4"
      >
        <Icon
          icon="ellipsis-vertical"
          iconLibrary="lucide"
          size={16}
          className="text-gray-500 dark:text-gray-400"
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 bg-white dark:bg-[#1a1a1b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden min-w-[160px]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function MobileActionButtons() {
  return (
    <div className="flex lg:hidden items-center gap-3">
      <button
        type="button"
        className="text-gray-500 w-8 h-8 flex items-center justify-center hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        id="search-bar-entry-mobile"
        onClick={openSearch}
        aria-label="Open search"
      >
        <span className="sr-only">Search...</span>
        <Icon icon="search" iconLibrary="lucide" size={16} color="currentColor" />
      </button>

      <button
        id="assistant-entry-mobile"
        onClick={toggleAssistant}
        aria-label="Toggle assistant panel"
        className="flex items-center justify-center"
      >
        <SparkleIcon />
      </button>

      <MobileEllipsisMenu />
    </div>
  );
}

export function MobileNavToggle({
  pageTitle,
  groupName,
}: {
  pageTitle: string;
  groupName?: string;
}) {
  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
  };

  return (
    <button
      type="button"
      className="flex items-center h-14 py-4 px-5 lg:px-[5vw] lg:hidden focus:outline-0 w-full text-left"
      onClick={handleToggle}
    >
      <div className="flex items-center text-gray-500 hover:text-gray-600">
        <span className="sr-only">Navigation</span>
        <Icon icon="menu" iconLibrary="lucide" size={18} />
      </div>
      <div className="ml-4 flex text-sm leading-6 whitespace-nowrap min-w-0 space-x-3 overflow-hidden">
        {groupName && (
          <div className="flex items-center space-x-3 shrink-0">
            <span>{groupName}</span>
            <Icon
              icon="chevron-right"
              iconLibrary="lucide"
              size={16}
              className="text-gray-400"
            />
          </div>
        )}
        <div className="font-semibold text-gray-900 truncate min-w-0 flex-1">
          {pageTitle}
        </div>
      </div>
    </button>
  );
}
