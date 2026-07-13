import { Link } from 'react-router-dom';

function CipherLogo({ size = 'regular' }) {
  return (
    <span className={`cipher-logo cipher-logo--${size}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6.5A7.5 7.5 0 1 0 18 17.5" />
        <path d="M6.5 12h8" stroke="var(--con)" opacity="0.9" />
        <circle cx="15.5" cy="12" r="1.5" fill="var(--con)" stroke="none" />
      </svg>
    </span>
  );
}

function BrandMark({ compact = false, large = false, onClick }: { compact?: boolean; large?: boolean; onClick?: () => void }) {
  const content = (
    <>
      <CipherLogo size={large ? 'large' : compact ? 'regular' : 'large'} />
      <span className="brand-mark__copy">
        <span className={`brand-mark__name${large ? ' brand-mark__name--lg' : ''}`}>Cipher</span>
        {!compact && !large ? <span className="brand-mark__tagline">Sentiment Intelligence</span> : null}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="brand-mark" onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link className="brand-mark" to="/discover">
      {content}
    </Link>
  );
}

export default BrandMark;
