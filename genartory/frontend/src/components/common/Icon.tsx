// frontend/src/components/common/Icon.tsx
import React from 'react';
import styles from './Icon.module.css';
import clsx from 'clsx'; // For conditionally combining classes

interface IconProps {
  iconName: string;
  library?: 'material-icons' | 'font-awesome'; // Add more libraries as needed
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  iconName,
  library = 'material-icons',
  size = 'medium',
  color
}) => {
  const iconClasses = clsx(
    styles.icon,
    styles[`icon--${library}`],
    styles[`icon--${size}`],
  );

  const iconStyle = color ? { color } : {};

  return (
    <span className={iconClasses} style={iconStyle}>
      {iconName}
    </span>
  );
};

export default Icon;
