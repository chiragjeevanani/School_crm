import { schoolService } from '../services/school.service.js';

export async function listSchools(req, res, next) {
  try {
    const result = await schoolService.listSchools({
      search: req.query?.search,
      status: req.query?.status,
      plan: req.query?.plan,
      page: req.query?.page,
      limit: req.query?.limit,
    });

    res.json({ success: true, data: result.data, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
}

export async function createSchool(req, res, next) {
  try {
    const data = await schoolService.createSchool(req.body, req.user?.sub || null);

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: data.school,
      credentials: data.credentials,
      emailSent: data.emailSent,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSchool(req, res, next) {
  try {
    const data = await schoolService.updateSchool(req.params.id, req.body);

    res.json({
      success: true,
      message: 'School updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSchoolStatus(req, res, next) {
  try {
    const data = await schoolService.updateStatus(req.params.id, req.body?.status);

    res.json({
      success: true,
      message: 'School status updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSchool(req, res, next) {
  try {
    const data = await schoolService.deleteSchool(req.params.id);

    res.json({
      success: true,
      message: 'School deleted successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetSchoolLogin(req, res, next) {
  try {
    const credentials = await schoolService.resetLogin(req.params.id);
    res.json({
      success: true,
      message: credentials.emailSent
        ? 'School admin login reset and emailed'
        : 'School admin login reset',
      credentials,
      emailSent: credentials.emailSent,
    });
  } catch (error) {
    next(error);
  }
}

export async function schoolAdminLogin(req, res, next) {
  try {
    const result = await schoolService.loginSchoolAdmin(req.body || {});
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function schoolPortalMe(req, res, next) {
  try {
    const result = await schoolService.getPortalSchool(req.user?.sub);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function schoolPortalPlans(req, res, next) {
  try {
    const { subscriptionService } = await import('../services/subscription.service.js');
    const data = await subscriptionService.listPlans();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function schoolSelectPlan(req, res, next) {
  try {
    const result = await schoolService.selectPlan(req.user?.sub, req.body?.planId);
    res.json({
      success: true,
      message: 'Plan selected. Super Admin will update billing status.',
      ...result,
    });
  } catch (error) {
    next(error);
  }
}
