
const ElectryptionLogo = ({ size = 'medium', variant = 'full', className = '' }) => {
  const sizes = {
    small: { width: 32, height: 32 },
    medium: { width: 64, height: 64 },
    large: { width: 128, height: 128 },
    xlarge: { width: 256, height: 256 }
  };

  const { width, height } = sizes[size] || sizes.medium;

  if (variant === 'text') {
    return (
      <div className={`electryption-text-logo ${className}`}>
        <img
          src="/text-logo.svg"
          alt="Electryption - Secure Blockchain E-Voting System"
          style={{ height: height / 2, width: 'auto' }}
        />
      </div>
    );
  }

  // For both favicon and full variants, use the new logo
  return (
    <img
      src="/electryption-logo.svg"
      alt="Electryption - Secure Blockchain E-Voting System"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default ElectryptionLogo;

// Usage examples:
// <ElectryptionLogo size="large" variant="full" />
// <ElectryptionLogo size="small" variant="favicon" />
// <ElectryptionLogo size="medium" variant="text" />
