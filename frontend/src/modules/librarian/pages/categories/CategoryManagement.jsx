import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { MOCK_CATEGORIES } from '../../utils/constants';
import { Plus, FolderPlus, Edit, Eye, Tag } from 'lucide-react';

export const CategoryManagement = () => {
  const toast = useToast();
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newSubCats, setNewSubCats] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSave = () => {
    if (!newCatName.trim()) {
      toast.error('Category name is required.');
      return;
    }

    const subArr = newSubCats.split(',').map(s => s.trim()).filter(Boolean);

    if (editingIndex !== null) {
      setCategories(prev => prev.map((c, i) => i === editingIndex ? { 
        ...c, 
        name: newCatName, 
        subCategories: subArr 
      } : c));
      toast.success('Category updated successfully.');
    } else {
      setCategories(prev => [...prev, {
        name: newCatName,
        bookCount: 0,
        subCategories: subArr
      }]);
      toast.success('New category added.');
    }

    setModalOpen(false);
    setNewCatName('');
    setNewSubCats('');
    setEditingIndex(null);
  };

  const handleEdit = (cat, idx) => {
    setEditingIndex(idx);
    setNewCatName(cat.name);
    setNewSubCats(cat.subCategories.join(', '));
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Categories"
        subtitle="Manage and organize library classification nodes."
        actions={
          <button
            onClick={() => {
              setEditingIndex(null);
              setNewCatName('');
              setNewSubCats('');
              setModalOpen(true);
            }}
            className="h-10 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all duration-150 shadow-xs"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div 
            key={cat.name}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xs group hover:border-amber-300 dark:hover:border-amber-900/50 transition-all duration-205"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Tag className="h-5 w-5" />
                </div>
                <Badge variant="amber">
                  {cat.bookCount} Books
                </Badge>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {cat.name}
              </h4>

              {/* Sub categories */}
              {cat.subCategories.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  <span className="text-3xs font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wider block">
                    Sub-Categories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subCategories.map(sub => (
                      <span 
                        key={sub}
                        className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg text-3xs font-semibold text-slate-650 dark:text-slate-350"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex gap-2">
              <button
                onClick={() => handleEdit(cat, idx)}
                className="flex-1 h-9 text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-250 dark:border-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Modify Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? 'Modify Category' : 'Register New Classification Node'}
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-2xs font-bold text-slate-550 dark:text-slate-450">Category Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full h-10 px-3 border border-slate-205 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. Technology"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-2xs font-bold text-slate-550 dark:text-slate-450">Sub-Categories</label>
            <textarea
              rows={3}
              value={newSubCats}
              onChange={(e) => setNewSubCats(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. Physics, Chemistry, Astronomy (comma separated)"
            />
            <span className="text-4xs text-slate-400 block">Separate multiple subcategories with commas.</span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
            <button
              onClick={() => setModalOpen(false)}
              className="h-10 px-4 text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="h-10 px-4 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
