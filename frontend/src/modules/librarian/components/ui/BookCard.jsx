import React from 'react';
import { BookOpen, MapPin, Hash, User } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

export const BookCard = ({ book, onView, onEdit }) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-all duration-200 hover:border-amber-300 dark:hover:border-amber-900/50 group flex flex-col justify-between">
      <div>
        {/* Book cover visual and details */}
        <div className="flex gap-4">
          <div className="w-20 h-28 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-102 transition-transform duration-200 relative overflow-hidden">
            {/* Book spine aesthetic lines */}
            <div className="absolute left-1 top-0 bottom-0 w-1 bg-amber-800/30" />
            <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-amber-400/20" />
            <BookOpen className="h-8 w-8 text-amber-100" />
            <span className="absolute bottom-2 text-3xs text-amber-200 font-mono tracking-widest">{book.id}</span>
          </div>

          <div className="flex-1 space-y-1">
            <Badge 
              variant={isAvailable ? 'success' : 'danger'}
              className="mb-1"
            >
              {isAvailable ? `${book.availableCopies}/${book.totalCopies} Available` : 'Issued Out'}
            </Badge>
            <h4 
              onClick={() => onView && onView(book)}
              className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
            >
              {book.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{book.author}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Hash className="h-3.5 w-3.5" />
              <span className="font-mono text-3xs">{book.bookCode}</span>
            </div>
          </div>
        </div>

        {/* Shelf location & rack info */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Rack {book.rackNumber}, Shelf {book.shelfNumber}</span>
          </div>
          <span className="font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-850">
            {book.category}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onView && onView(book)}
          className="flex-1 h-9 text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all duration-150"
        >
          View Details
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(book)}
            className="px-3 h-9 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:text-amber-400 rounded-xl transition-all duration-150"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};
