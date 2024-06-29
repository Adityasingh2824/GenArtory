// frontend/src/components/common/Typography.tsx
import React from 'react';
import styles from './Typography.module.css';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption'; // Define your variants
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({ variant = 'body1', children }) => {
  const Component = variant as keyof JSX.IntrinsicElements; // Cast variant to valid HTML tag
  return <Component className={styles[variant]}>{children}</Component>;
};
// frontend/src/components/common/Typography.tsx

interface TypographyProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption';
    children: React.ReactNode;
    color?: string;
    align?: 'left' | 'center' | 'right';
    gutterBottom?: boolean; // Add margin-bottom
  }
  
  const Typography: React.FC<TypographyProps> = ({
    variant = 'body1',
    children,
    color,
    align,
    gutterBottom,
  }) => {
    return (
      <p
        className={clsx(
          styles.typography,
          styles[`typography--${variant}`],
          align && styles[`typography--align-${align}`],
          gutterBottom && styles['typography--gutterBottom']
        )}
        style={{ color }} // Apply custom color if provided
      >
        {children}
      </p>
    );
  };
  

export default Typography;
