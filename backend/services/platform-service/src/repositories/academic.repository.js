import mongoose from 'mongoose';
import { AcademicYear } from '../models/AcademicYear.js';
import { SchoolClass } from '../models/SchoolClass.js';
import { AcademicYearClass } from '../models/AcademicYearClass.js';
import { Section } from '../models/Section.js';
import { Subject } from '../models/Subject.js';
import { SectionSubject } from '../models/SectionSubject.js';
import { Teacher } from '../models/Teacher.js';
import { StudentEnrollment } from '../models/StudentEnrollment.js';

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

export class AcademicRepository {
  // Academic Years
  listYears(schoolId, { search, status, page = 1, limit = 20 } = {}) {
    const query = { schoolId: toObjectId(schoolId) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;
    return Promise.all([
      AcademicYear.find(query).sort({ startDate: -1 }).skip(skip).limit(safeLimit),
      AcademicYear.countDocuments(query),
    ]).then(([items, total]) => ({ items, total, page: safePage, limit: safeLimit }));
  }

  findYearById(schoolId, id) {
    return AcademicYear.findOne({ _id: id, schoolId: toObjectId(schoolId) });
  }

  createYear(payload) {
    return AcademicYear.create(payload);
  }

  updateYear(schoolId, id, payload) {
    return AcademicYear.findOneAndUpdate({ _id: id, schoolId: toObjectId(schoolId) }, payload, {
      new: true,
      runValidators: true,
    });
  }

  clearCurrentYear(schoolId, exceptId = null) {
    const query = { schoolId: toObjectId(schoolId), isCurrent: true };
    if (exceptId) query._id = { $ne: exceptId };
    return AcademicYear.updateMany(query, { isCurrent: false });
  }

  // Classes
  listClasses(schoolId, { search, status, page = 1, limit = 50 } = {}) {
    const query = { schoolId: toObjectId(schoolId) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50));
    const skip = (safePage - 1) * safeLimit;
    return Promise.all([
      SchoolClass.find(query).sort({ numericOrder: 1, name: 1 }).skip(skip).limit(safeLimit),
      SchoolClass.countDocuments(query),
    ]).then(([items, total]) => ({ items, total, page: safePage, limit: safeLimit }));
  }

  findClassById(schoolId, id) {
    return SchoolClass.findOne({ _id: id, schoolId: toObjectId(schoolId) });
  }

  createClass(payload) {
    return SchoolClass.create(payload);
  }

  updateClass(schoolId, id, payload) {
    return SchoolClass.findOneAndUpdate({ _id: id, schoolId: toObjectId(schoolId) }, payload, {
      new: true,
      runValidators: true,
    });
  }

  // Academic Year Classes
  listYearClasses(schoolId, academicYearId) {
    return AcademicYearClass.find({
      schoolId: toObjectId(schoolId),
      academicYearId,
    }).sort({ createdAt: 1 });
  }

  findYearClass(schoolId, academicYearId, classId) {
    return AcademicYearClass.findOne({
      schoolId: toObjectId(schoolId),
      academicYearId,
      classId,
    });
  }

  createYearClass(payload) {
    return AcademicYearClass.create(payload);
  }

  deleteYearClass(schoolId, academicYearId, classId) {
    return AcademicYearClass.findOneAndDelete({
      schoolId: toObjectId(schoolId),
      academicYearId,
      classId,
    });
  }

  // Sections
  listSections(schoolId, filters = {}) {
    const query = { schoolId: toObjectId(schoolId) };
    if (filters.academicYearId) query.academicYearId = filters.academicYearId;
    if (filters.classId) query.classId = filters.classId;
    if (filters.status) query.status = filters.status;
    return Section.find(query).sort({ name: 1 });
  }

  findSectionById(schoolId, id) {
    return Section.findOne({ _id: id, schoolId: toObjectId(schoolId) });
  }

  createSection(payload) {
    return Section.create(payload);
  }

  updateSection(schoolId, id, payload) {
    return Section.findOneAndUpdate({ _id: id, schoolId: toObjectId(schoolId) }, payload, {
      new: true,
      runValidators: true,
    });
  }

  findSectionWithClassTeacher(schoolId, academicYearId, classTeacherId, excludeSectionId = null) {
    const query = {
      schoolId: toObjectId(schoolId),
      academicYearId: toObjectId(academicYearId),
      classTeacherId: toObjectId(classTeacherId),
      status: 'ACTIVE',
    };
    if (excludeSectionId) {
      query._id = { $ne: toObjectId(excludeSectionId) };
    }
    return Section.findOne(query);
  }

  // Subjects
  listSubjects(schoolId, { search, status, page = 1, limit = 50 } = {}) {
    const query = { schoolId: toObjectId(schoolId) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50));
    const skip = (safePage - 1) * safeLimit;
    return Promise.all([
      Subject.find(query).sort({ name: 1 }).skip(skip).limit(safeLimit),
      Subject.countDocuments(query),
    ]).then(([items, total]) => ({ items, total, page: safePage, limit: safeLimit }));
  }

  findSubjectById(schoolId, id) {
    return Subject.findOne({ _id: id, schoolId: toObjectId(schoolId) });
  }

  createSubject(payload) {
    return Subject.create(payload);
  }

  updateSubject(schoolId, id, payload) {
    return Subject.findOneAndUpdate({ _id: id, schoolId: toObjectId(schoolId) }, payload, {
      new: true,
      runValidators: true,
    });
  }

  // Section Subjects
  listSectionSubjects(schoolId, sectionId) {
    return SectionSubject.find({
      schoolId: toObjectId(schoolId),
      sectionId,
    }).sort({ createdAt: 1 });
  }

  findSectionSubjectById(schoolId, id) {
    return SectionSubject.findOne({ _id: id, schoolId: toObjectId(schoolId) });
  }

  findSectionSubjectDuplicate(schoolId, sectionId, subjectId, excludeId = null) {
    const query = {
      schoolId: toObjectId(schoolId),
      sectionId,
      subjectId,
    };
    if (excludeId) query._id = { $ne: excludeId };
    return SectionSubject.findOne(query);
  }

  createSectionSubject(payload) {
    return SectionSubject.create(payload);
  }

  updateSectionSubject(schoolId, id, payload) {
    return SectionSubject.findOneAndUpdate({ _id: id, schoolId: toObjectId(schoolId) }, payload, {
      new: true,
      runValidators: true,
    });
  }

  deleteSectionSubject(schoolId, id) {
    return SectionSubject.findOneAndDelete({ _id: id, schoolId: toObjectId(schoolId) });
  }

  // Teachers
  listTeachers(schoolId, { search, status } = {}) {
    const query = { schoolId: toObjectId(schoolId) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    return Teacher.find(query).sort({ name: 1 });
  }

  findTeacherById(schoolId, id) {
    return Teacher.findOne({ _id: id, schoolId: toObjectId(schoolId) });
  }

  createTeacher(payload) {
    return Teacher.create(payload);
  }

  updateTeacher(schoolId, id, payload) {
    return Teacher.findOneAndUpdate({ _id: id, schoolId: toObjectId(schoolId) }, payload, {
      new: true,
      runValidators: true,
    });
  }

  deleteTeacher(schoolId, id) {
    return Teacher.findOneAndDelete({ _id: id, schoolId: toObjectId(schoolId) });
  }

  // Counts
  countSectionsForYear(schoolId, academicYearId) {
    return Section.countDocuments({ schoolId: toObjectId(schoolId), academicYearId });
  }

  countSectionsForClass(schoolId, academicYearId, classId) {
    return Section.countDocuments({
      schoolId: toObjectId(schoolId),
      academicYearId,
      classId,
    });
  }

  countYearClasses(schoolId, academicYearId) {
    return AcademicYearClass.countDocuments({
      schoolId: toObjectId(schoolId),
      academicYearId,
      status: 'ACTIVE',
    });
  }

  countEnrollments(schoolId, filters = {}) {
    const query = { schoolId: toObjectId(schoolId), status: 'ACTIVE' };
    if (filters.academicYearId) query.academicYearId = filters.academicYearId;
    if (filters.sectionId) query.sectionId = filters.sectionId;
    if (filters.classId) query.classId = filters.classId;
    return StudentEnrollment.countDocuments(query);
  }

  countSectionSubjects(schoolId, filters = {}) {
    const query = { schoolId: toObjectId(schoolId), status: 'ACTIVE' };
    if (filters.sectionId) query.sectionId = filters.sectionId;
    if (filters.academicYearId) query.academicYearId = filters.academicYearId;
    if (filters.classId) query.classId = filters.classId;
    return SectionSubject.countDocuments(query);
  }

  hasDependentRecords(schoolId, academicYearId) {
    return Promise.all([
      StudentEnrollment.countDocuments({ schoolId: toObjectId(schoolId), academicYearId }),
      Section.countDocuments({ schoolId: toObjectId(schoolId), academicYearId }),
    ]).then(([enrollments, sections]) => enrollments > 0 || sections > 0);
  }

  classHasDependents(schoolId, classId) {
    return Promise.all([
      Section.countDocuments({ schoolId: toObjectId(schoolId), classId }),
      AcademicYearClass.countDocuments({ schoolId: toObjectId(schoolId), classId }),
      StudentEnrollment.countDocuments({ schoolId: toObjectId(schoolId), classId }),
    ]).then(([sections, mappings, enrollments]) => sections > 0 || mappings > 0 || enrollments > 0);
  }

  sectionHasDependents(schoolId, sectionId) {
    return Promise.all([
      StudentEnrollment.countDocuments({ schoolId: toObjectId(schoolId), sectionId }),
      SectionSubject.countDocuments({ schoolId: toObjectId(schoolId), sectionId }),
    ]).then(([enrollments, subjects]) => enrollments > 0 || subjects > 0);
  }

  teacherAssignmentCounts(schoolId, teacherId) {
    return Promise.all([
      Section.countDocuments({ schoolId: toObjectId(schoolId), classTeacherId: teacherId }),
      SectionSubject.countDocuments({ schoolId: toObjectId(schoolId), teacherId }),
    ]).then(([classTeacherSections, subjectAssignments]) => ({
      classTeacherSections,
      subjectAssignments,
      totalAssignments: classTeacherSections + subjectAssignments,
    }));
  }

  teacherHasDependents(schoolId, teacherId) {
    return this.teacherAssignmentCounts(schoolId, teacherId).then(
      ({ totalAssignments }) => totalAssignments > 0
    );
  }
}

export const academicRepository = new AcademicRepository();
