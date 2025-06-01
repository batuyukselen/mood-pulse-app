import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'white' | 'outline';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  href?: string;
}

type ButtonAttributes = ButtonHTMLAttributes<HTMLButtonElement> & 
  AnchorHTMLAttributes<HTMLAnchorElement> & 
  ButtonProps;

const Button: React.FC<ButtonAttributes> = ({
  children,
  variant = 'primary',
  className = '',
  href,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200";
  
  const variantStyles = {
    primary: "bg-[#5B3DF4] text-white hover:bg-[#5B3DF4]/90 transform hover:scale-105",
    ghost: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    white: "bg-white text-[#5B3DF4] hover:bg-white/90 transform hover:scale-105",
    outline: "bg-transparent text-[#5B3DF4] border border-[#5B3DF4] hover:bg-[#5B3DF4]/10"
  };
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={styles} {...props}>
        {children}
      </a>
    );
  }
  
  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
};

export default Button;