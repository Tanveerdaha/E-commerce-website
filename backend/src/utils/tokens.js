import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const getAccessSecret = () => process.env.JWT_SECRET;
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET}-refresh`;

const buildPayload = (user, type) => ({
  id: user._id?.toString?.() || user.id,
  email: user.email,
  role: user.role || 'user',
  type,
});

export const createAccessToken = (user) => jwt.sign(
  buildPayload(user, 'access'),
  getAccessSecret(),
  { expiresIn: ACCESS_EXPIRES_IN },
);

export const createRefreshToken = (user) => jwt.sign(
  buildPayload(user, 'refresh'),
  getRefreshSecret(),
  { expiresIn: REFRESH_EXPIRES_IN },
);

export const createAuthTokens = (user) => {
  const accessToken = createAccessToken(user);
  return {
    accessToken,
    refreshToken: createRefreshToken(user),
    // Alias kept for older clients / tests that still expect `token`
    token: accessToken,
  };
};

export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, getAccessSecret());
  if (decoded.type && decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }
  return decoded;
};

export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, getRefreshSecret());
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded;
};
