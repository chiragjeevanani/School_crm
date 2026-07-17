import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { useToast } from '../../components/ui/Toast';

export const AddEditBook = ({ book, onSuccess, onCancel }) => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    id: book?.id || `BK-0${Math.floor(Math.random() * 900) + 100}`,
    bookCode: book?.bookCode || `GFS-BK-${Math.floor(Math.random() * 900) + 100}`,
    title: book?.title || '',
    author: book?.author || '',
    publisher: book?.publisher || '',
    publicationYear: book?.publicationYear || 2026,
    edition: book?.edition || '1st',
    language: book?.language || 'English',
    category: book?.category || 'Science',
    subject: book?.subject || '',
    rackNumber: book?.rackNumber || '',
    shelfNumber: book?.shelfNumber || '',
    bookCost: book?.bookCost || 0,
    purchaseDate: book?.purchaseDate || new Date().toISOString().split('T')[0],
    supplier: book?.supplier || '',
    totalCopies: book?.totalCopies || 1,
    availableCopies: book?.availableCopies || 1,
    isbn: book?.isbn || '',
    barcode: book?.barcode || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'bookCost' || name === 'totalCopies' || name === 'publicationYear' ? Number(value) : value 
    }));
  };

  const handleNext = () => {
    // Basic validation
    if (step === 1) {
      if (!formData.title.trim() || !formData.author.trim() || !formData.publisher.trim()) {
        toast.error('Please fill in title, author, and publisher.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.category.trim() || !formData.rackNumber.trim() || !formData.shelfNumber.trim()) {
        toast.error('Please specify category, rack number, and shelf number.');
        return;
      }
    }
    if (step === 3) {
      if (formData.bookCost <= 0 || formData.totalCopies <= 0) {
        toast.error('Please enter valid cost and copies quantity.');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.isbn.trim()) {
      toast.error('Please enter the ISBN code.');
      return;
    }
    // Auto-generate barcode from ISBN if empty
    const finalData = {
      ...formData,
      barcode: formData.barcode.trim() || formData.isbn.replace(/[- ]/g, ''),
      availableCopies: book ? formData.availableCopies : formData.totalCopies
    };
    
    toast.success(book ? 'Book catalog updated successfully!' : 'New book registered successfully!');
    onSuccess(finalData);
  };

  const stepTitles = [
    'Basic Details',
    'Classification & Location',
    'Acquisition Details',
    'Identifiers'
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex justify-between items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        {stepTitles.map((title, idx) => {
          const index = idx + 1;
          const isActive = index === step;
          const isCompleted = index < step;
          return (
            <div key={title} className="flex-1 flex flex-col items-center text-center">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border",
                isActive 
                  ? "bg-amber-600 border-amber-600 text-white shadow-xs" 
                  : isCompleted 
                    ? "bg-emerald-500 border-emerald-500 text-white" 
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-450"
              )}>
                {index}
              </div>
              <span className={cn(
                "text-4xs font-bold uppercase tracking-wider mt-1.5 hidden sm:block",
                isActive ? "text-amber-600 dark:text-amber-400" : "text-slate-400"
              )}>
                {title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Forms steps inputs container */}
      <div className="space-y-4">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Book Title <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. A Brief History of Time"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Author Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Stephen Hawking"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Publisher <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Bantam Books"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Publication Year</label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Edition</label>
              <input
                type="text"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. 10th Anniversary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Category <span className="text-rose-500">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Literature">Literature</option>
                <option value="History">History</option>
                <option value="Technology">Technology</option>
                <option value="Fiction">Fiction</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Physics"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Rack Number <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="rackNumber"
                value={formData.rackNumber}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. R-04"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Shelf Number <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="shelfNumber"
                value={formData.shelfNumber}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. S-12"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Book Cost (INR) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                name="bookCost"
                value={formData.bookCost}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Quantity Copies <span className="text-rose-500">*</span></label>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Supplier Name</label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Oxford Press India"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">ISBN Code <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. 978-0-553-38016-3"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-2xs font-bold text-slate-550 dark:text-slate-400">Custom Barcode Value (Optional)</label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Leave blank to auto-use ISBN without hyphens"
              />
            </div>
          </div>
        )}
      </div>

      {/* Wizards control actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
        <button
          onClick={onCancel}
          className="h-10 px-4 text-sm font-semibold border border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-colors"
        >
          Cancel
        </button>
        {step > 1 && (
          <button
            onClick={handleBack}
            className="h-10 px-4 text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-colors"
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="h-10 px-4 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all duration-150"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="h-10 px-4 text-sm font-semibold bg-amber-650 hover:bg-amber-700 text-white rounded-xl transition-all duration-150 shadow-xs"
          >
            Save Book Record
          </button>
        )}
      </div>
    </div>
  );
};
