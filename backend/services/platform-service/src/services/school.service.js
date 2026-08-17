import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AppError } from '../../../shared/AppError.js';
import { signAccessToken } from '../../../shared/generateToken.js';
import { env } from '../config/env.js';
import { sendSchoolWelcomeEmail } from '../config/mailer.js';
import { schoolRepository } from '../repositories/school.repository.js';
import { subscriptionRepository } from '../repositories/subscription.repository.js';
import { billingService } from './billing.service.js';

const SCHOOL_TYPES = ['Public', 'Private', 'Government', 'Government Aided', 'International', 'Other'];
const SCHOOL_BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];
const SCHOOL_MEDIA = ['English', 'Hindi', 'English + Hindi', 'Other'];
const SCHOOL_STATUSES = ['Active', 'Inactive', 'Trial', 'Suspended'];
const CLASS_OPTIONS = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function requireText(value, label) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) {
    throw new AppError(`${label} is required`, 400);
  }
  return text;
}

function normalizeIndianMobile(value, label, required = true) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) {
    if (required) {
      throw new AppError(`${label} is required`, 400);
    }
    return '';
  }

  let digits = text.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    throw new AppError(`${label} must be a 10-digit Indian mobile number with +91`, 400);
  }

  return `+91${digits}`;
}

function optionalText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function optionalNumber(value, label) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return null;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new AppError(`${label} must be a valid number`, 400);
  }

  return parsed;
}

function optionalYear(value) {
  const year = optionalNumber(value, 'Established year');
  if (year === null) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  if (year < 1800 || year > currentYear) {
    throw new AppError(`Established year must be between 1800 and ${currentYear}`, 400);
  }

  return year;
}

function ensureOption(value, options, label) {
  const text = requireText(value, label);
  if (!options.includes(text)) {
    throw new AppError(`${label} is invalid`, 400);
  }
  return text;
}

function normalizeSchoolId(value) {
  const normalized = requireText(value, 'School ID')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!normalized) {
    throw new AppError('School ID is required', 400);
  }

  return normalized;
}

function normalizeCode(value) {
  return requireText(value, 'School code').toUpperCase();
}

function normalizeWebsite(value) {
  const text = optionalText(value);
  if (!text) return '';

  if (!/^https?:\/\//i.test(text)) {
    return `https://${text}`;
  }

  return text;
}

function normalizeLogo(value) {
  const text = optionalText(value);
  if (!text) return '';

  if (text.startsWith('data:image/')) {
    if (text.length > 3_000_000) {
      throw new AppError('Logo image is too large. Please upload an image under 2MB.', 400);
    }
    return text;
  }

  if (/^https?:\/\/.+/i.test(text)) {
    return text;
  }

  throw new AppError('Logo must be a valid image file', 400);
}

function normalizeWorkingDays(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((day) => WORKING_DAYS.includes(day)))];
}

function normalizePayload(payload, createdBy) {
  const classFrom = ensureOption(payload?.academic?.classFrom, CLASS_OPTIONS, 'Classes from');
  const classTo = ensureOption(payload?.academic?.classTo, CLASS_OPTIONS, 'Classes to');

  if (CLASS_OPTIONS.indexOf(classFrom) > CLASS_OPTIONS.indexOf(classTo)) {
    throw new AppError('Classes from cannot be after classes to', 400);
  }

  return {
    name: requireText(payload?.name, 'School name'),
    code: normalizeCode(payload?.code),
    schoolId: normalizeSchoolId(payload?.schoolId || payload?.name),
    type: ensureOption(payload?.type, SCHOOL_TYPES, 'School type'),
    board: ensureOption(payload?.board, SCHOOL_BOARDS, 'Board'),
    establishedYear: optionalYear(payload?.establishedYear),
    logo: normalizeLogo(payload?.logo),
    website: normalizeWebsite(payload?.website),
    contact: {
      email: requireText(payload?.contact?.email, 'Official email').toLowerCase(),
      phone: normalizeIndianMobile(payload?.contact?.phone, 'Phone number'),
      alternatePhone: normalizeIndianMobile(payload?.contact?.alternatePhone, 'Alternate phone', false),
      principalName: optionalText(payload?.contact?.principalName),
    },
    address: {
      line1: requireText(payload?.address?.line1, 'Address line 1'),
      line2: optionalText(payload?.address?.line2),
      city: requireText(payload?.address?.city, 'City'),
      state: requireText(payload?.address?.state, 'State'),
      country: requireText(payload?.address?.country, 'Country'),
      pincode: requireText(payload?.address?.pincode, 'Pincode'),
      latitude: optionalNumber(payload?.address?.latitude, 'Latitude'),
      longitude: optionalNumber(payload?.address?.longitude, 'Longitude'),
    },
    academic: {
      session: requireText(payload?.academic?.session, 'Academic session'),
      classFrom,
      classTo,
      medium: ensureOption(payload?.academic?.medium, SCHOOL_MEDIA, 'Medium'),
      workingDays: normalizeWorkingDays(payload?.academic?.workingDays),
    },
    admin: {
      name: requireText(
        payload?.admin?.name || payload?.contact?.principalName || payload?.name,
        'Admin name'
      ),
      email: requireText(payload?.admin?.email || payload?.contact?.email, 'Admin email').toLowerCase(),
      mobile: normalizeIndianMobile(payload?.admin?.mobile || payload?.contact?.phone, 'Admin mobile'),
    },
    subscriptionPlan: optionalText(payload?.subscriptionPlan),
    status: ensureOption(payload?.status, SCHOOL_STATUSES, 'Status'),
    createdBy,
  };
}

function mapMongoError(error) {
  if (error?.code !== 11000) {
    throw error;
  }

  const duplicatedField = Object.keys(error.keyPattern || {})[0];
  if (duplicatedField === 'code') {
    throw new AppError('School code already exists', 409);
  }

  if (duplicatedField === 'schoolId') {
    throw new AppError('School ID already exists', 409);
  }

  throw new AppError('A school with these details already exists', 409);
}

const BCRYPT_ROUNDS = 12;

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(10);
  let value = '';
  for (const byte of bytes) {
    value += chars[byte % chars.length];
  }
  return `${value}!`;
}

async function setAdminPassword(school, plainPassword) {
  school.admin.passwordHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
  school.admin.hasLogin = true;
  await school.save();
  return {
    email: school.admin.email,
    password: plainPassword,
    schoolId: school.schoolId,
    schoolName: school.name,
  };
}

function toPortalUser(school) {
  return {
    id: school._id.toString(),
    name: school.admin.name,
    email: school.admin.email,
    phone: school.admin.mobile,
    role: 'School Admin',
    schoolId: school.schoolId,
    schoolName: school.name,
    academicSession: school.academic?.session || '',
    photo: school.logo || '',
    subscriptionPlan: school.subscriptionPlan || '',
    hasPlan: Boolean(school.subscriptionPlan),
  };
}

async function emailCredentials(credentials) {
  try {
    const sent = await sendSchoolWelcomeEmail({
      to: credentials.email,
      schoolName: credentials.schoolName,
      password: credentials.password,
      loginUrl: `${env.frontendUrl}/school-admin/login`,
    });
    return sent;
  } catch (error) {
    console.error('Welcome email failed:', error.message);
    return false;
  }
}

export class SchoolService {
  async listSchools(filters) {
    const { items, total, page, limit } = await schoolRepository.list(filters);
    return {
      data: items.map((school) => school.toPublicJSON()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async createSchool(payload, createdBy) {
    try {
      const next = normalizePayload(payload, createdBy);
      next.subscriptionPlan = '';
      const school = await schoolRepository.create(next);
      const requestedPassword = typeof payload?.admin?.password === 'string' ? payload.admin.password.trim() : '';
      if (requestedPassword && requestedPassword.length < 8) {
        throw new AppError('Admin password must be at least 8 characters', 400);
      }
      const credentials = await setAdminPassword(school, requestedPassword || generatePassword());
      const emailSent = await emailCredentials(credentials);
      return { school: school.toPublicJSON(), credentials, emailSent };
    } catch (error) {
      mapMongoError(error);
      throw error;
    }
  }

  async updateSchool(id, payload) {
    try {
      const current = await schoolRepository.findByIdWithPassword(id);
      if (!current) {
        throw new AppError('School not found', 404);
      }

      const next = normalizePayload(payload, undefined);
      delete next.createdBy;
      next.admin.passwordHash = current.admin.passwordHash || '';
      next.admin.hasLogin = Boolean(current.admin.hasLogin || current.admin.passwordHash);
      const school = await schoolRepository.updateById(id, next);

      if (!school) {
        throw new AppError('School not found', 404);
      }

      if (school.subscriptionPlan && school.subscriptionPlan !== current.subscriptionPlan) {
        await billingService.ensureSubscriptionInvoice(school, null);
      }

      return school.toPublicJSON();
    } catch (error) {
      mapMongoError(error);
      throw error;
    }
  }

  async updateStatus(id, status) {
    const nextStatus = ensureOption(status, SCHOOL_STATUSES, 'Status');
    const school = await schoolRepository.updateStatus(id, nextStatus);

    if (!school) {
      throw new AppError('School not found', 404);
    }

    return school.toPublicJSON();
  }

  async deleteSchool(id) {
    const school = await schoolRepository.deleteById(id);

    if (!school) {
      throw new AppError('School not found', 404);
    }

    return school.toPublicJSON();
  }

  async resetLogin(id) {
    const school = await schoolRepository.findByIdWithPassword(id);
    if (!school) {
      throw new AppError('School not found', 404);
    }
    const credentials = await setAdminPassword(school, generatePassword());
    const emailSent = await emailCredentials(credentials);
    return { ...credentials, emailSent };
  }

  async loginSchoolAdmin({ email, password }) {
    const normalizedEmail = email?.toLowerCase().trim();
    if (!normalizedEmail || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const school = await schoolRepository.findByAdminEmail(normalizedEmail);
    if (!school?.admin?.passwordHash) {
      throw new AppError('Invalid email or password', 401);
    }

    const matches = await bcrypt.compare(password, school.admin.passwordHash);
    if (!matches) {
      throw new AppError('Invalid email or password', 401);
    }

    if (school.status === 'Suspended') {
      throw new AppError('This school account is suspended', 403);
    }

    const token = signAccessToken(
      { sub: school._id.toString(), role: 'SchoolAdmin', schoolId: school.schoolId },
      { secret: env.jwtSecret, expiresIn: env.jwtExpiresIn }
    );

    return {
      token,
      user: toPortalUser(school),
    };
  }

  async getPortalSchool(schoolId) {
    const school = await schoolRepository.findById(schoolId);
    if (!school) {
      throw new AppError('School not found', 404);
    }
    return { user: toPortalUser(school) };
  }

  async selectPlan(schoolId, planId) {
    const school = await schoolRepository.findById(schoolId);
    if (!school) {
      throw new AppError('School not found', 404);
    }
    if (school.subscriptionPlan) {
      throw new AppError('A subscription plan is already selected for this school', 400);
    }

    const plan = await subscriptionRepository.findById(planId);
    if (!plan) {
      throw new AppError('Subscription plan not found', 404);
    }

    school.subscriptionPlan = plan.name;
    await school.save();

    const invoice = await billingService.ensureSubscriptionInvoice(school, schoolId);

    return {
      user: toPortalUser(school),
      invoice,
    };
  }
}

export const schoolService = new SchoolService();
