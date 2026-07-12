import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Pagination({ currentPage, totalPages, onPageChange, className }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 pl-2.5"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <Button
              variant={page === currentPage ? 'outline' : 'ghost'}
              size="icon"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </li>
        ))}
        <li>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 pr-2.5"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
