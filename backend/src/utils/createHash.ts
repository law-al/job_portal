import crypto from 'crypto';

export const createHash = () => {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');

  return {
    token: verifyToken,
    hashedToken: hashedResetToken,
  };
};
