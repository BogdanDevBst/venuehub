import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../../database/client';
import config from '../../config';
import { AuthenticationError, ValidationError } from '../../utils/errors';

interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface JWTPayload {
  userId: string;
  tenantId: string;
  role: string;
}

// Pure function to hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Pure function to compare passwords
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Generate JWT token
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

// Generate refresh token
export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as any);
};

// Verify token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
};

// Register new user
export const registerUser = async (data: RegisterUserData) => {
  const { email, password, firstName, lastName, tenantId, role = 'customer' } = data;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  // Validate password strength
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  // Check if user exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ValidationError('User already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Insert user
  const result = await query(
    `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, first_name, last_name, role, created_at`,
    [tenantId, email, passwordHash, firstName, lastName, role]
  );

  return result.rows[0];
};

// Login user
export const loginUser = async (credentials: LoginCredentials) => {
  const { email, password } = credentials;

  // Get user
  const result = await query(
    `SELECT id, tenant_id, email, password_hash, first_name, last_name, role
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new AuthenticationError('Invalid credentials');
  }

  const user = result.rows[0];

  // Compare password
  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Generate tokens
  const tokenPayload: JWTPayload = {
    userId: user.id,
    tenantId: user.tenant_id,
    role: user.role,
  };

  const token = generateToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Remove password hash from response
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
    refreshToken,
  };
};

// Get user by ID
export const getUserById = async (userId: string) => {
  const result = await query(
    `SELECT id, tenant_id, email, first_name, last_name, role, avatar_url, email_verified, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AuthenticationError('User not found');
  }

  return result.rows[0];
};

// Refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  
  // Verify user still exists
  await getUserById(payload.userId);

  // Generate new access token
  const newToken = generateToken({
    userId: payload.userId,
    tenantId: payload.tenantId,
    role: payload.role,
  });

  return { token: newToken };
};
