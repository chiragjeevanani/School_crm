import { libraryService } from '../services/library.service.js';

function schoolId(req) {
  return req.user?.sub || req.schoolAdmin?.schoolId || req.user?.schoolId;
}

export async function getLibraryStats(req, res, next) {
  try {
    const data = await libraryService.getStats(schoolId(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function listBooks(req, res, next) {
  try {
    const result = await libraryService.listBooks(schoolId(req), req.query);
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBook(req, res, next) {
  try {
    const data = await libraryService.getBook(schoolId(req), req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createBook(req, res, next) {
  try {
    const data = await libraryService.createBook(schoolId(req), req.body);
    res.status(201).json({
      success: true,
      message: 'Library book added successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBook(req, res, next) {
  try {
    const data = await libraryService.updateBook(schoolId(req), req.params.id, req.body);
    res.json({
      success: true,
      message: 'Library book updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const result = await libraryService.deleteBook(schoolId(req), req.params.id);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

export async function listIssues(req, res, next) {
  try {
    const result = await libraryService.listIssues(schoolId(req), req.query);
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function issueBook(req, res, next) {
  try {
    const data = await libraryService.issueBook(schoolId(req), req.body);
    res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function returnBook(req, res, next) {
  try {
    const data = await libraryService.returnBook(schoolId(req), req.params.id, req.body);
    res.json({
      success: true,
      message: 'Book returned successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEligibleBorrowers(req, res, next) {
  try {
    const data = await libraryService.getEligibleBorrowers(schoolId(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
