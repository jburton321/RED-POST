import { ArrowRight, ChevronLeft } from 'lucide-react';

interface CTAButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: 'outline' | 'filled' | 'stroke';
  showArrow?: boolean;
  showBack?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function CTAButton({
  onClick,
  className = '',
  children = 'GET STARTED',
  variant = 'outline',
  showArrow = false,
  showBack = false,
  disabled = false,
  type = 'button',
}: CTAButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cta-btn cta-btn--${variant} ${className}`}
    >
      {showBack && <ChevronLeft size={16} strokeWidth={2.5} className="cta-btn__back-icon" />}
      <span className="cta-btn__text">{children}</span>
      {showArrow && <ArrowRight size={18} strokeWidth={2.5} />}
    </button>
  );
}
