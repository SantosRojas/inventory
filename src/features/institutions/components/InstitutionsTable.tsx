import { memo, useCallback } from "react";
import { Edit, Trash2, Building2 } from "lucide-react";
import type { InstitutionExtended } from "../types";

interface InstitutionsTableProps {
  institutions: InstitutionExtended[];
  onEdit: (institution: InstitutionExtended) => void;
  onDelete: (institution: InstitutionExtended) => void;
  isLoading?: boolean;
}

/* ----------------------------
 *  Loading State
 * ---------------------------- */
const LoadingState = () => (
  <div className="rounded-xl shadow-sm border bg-card border-[var(--color-border)] p-6">
    <div className="animate-pulse space-y-4">
      <div className="h-4 rounded w-1/4 bg-secondary"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 rounded bg-secondary"></div>
        ))}
      </div>
    </div>
  </div>
);

/* ----------------------------
 *  Empty State
 * ---------------------------- */
const EmptyState = () => (
  <div className="rounded-xl shadow-sm border bg-card border-[var(--color-border)] p-8 text-center">
    <Building2 className="mx-auto h-12 w-12 text-muted" />
    <h3 className="mt-2 text-sm font-medium text-primary">
      No hay instituciones
    </h3>
    <p className="mt-1 text-sm text-secondary">
      Comienza agregando una nueva institución.
    </p>
  </div>
);

/* ----------------------------
 *  Desktop Row
 * ---------------------------- */
const InstitutionRow = memo(
  ({
    institution,
    onEdit,
    onDelete,
  }: {
    institution: InstitutionExtended;
    onEdit: (institution: InstitutionExtended) => void;
    onDelete: (institution: InstitutionExtended) => void;
  }) => {
    const handleEdit = useCallback(
      () => onEdit(institution),
      [onEdit, institution]
    );
    const handleDelete = useCallback(
      () => onDelete(institution),
      [onDelete, institution]
    );

    return (
      <tr className="hover:bg-gray-50 transition-colors bg-card">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
          {institution.code}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
          {institution.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleEdit}
              className="p-1 rounded transition-all duration-200 hover:scale-105 text-[var(--color-primary)] bg-[var(--color-primary-light)]"
              title="Editar institución"
              aria-label={`Editar ${institution.name}`}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded transition-all duration-200 hover:scale-105 text-[var(--color-error)] bg-[var(--color-error-light)]"
              title="Eliminar institución"
              aria-label={`Eliminar ${institution.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);
InstitutionRow.displayName = "InstitutionRow";

/* ----------------------------
 *  Mobile Card
 * ---------------------------- */
const MobileInstitutionCard = ({
  institution,
  onEdit,
  onDelete,
}: {
  institution: InstitutionExtended;
  onEdit: (institution: InstitutionExtended) => void;
  onDelete: (institution: InstitutionExtended) => void;
}) => (
  <div className="p-4 space-y-3 hover:bg-gray-50 transition-colors bg-card">
    <div className="flex justify-between items-start">
      <div className="flex-1 space-y-1">
        <h3 className="text-sm font-medium text-primary">
          {institution.code}
        </h3>
        <p className="text-sm text-secondary">{institution.name}</p>
      </div>
      <div className="flex space-x-2 ml-4">
        <button
          onClick={() => onEdit(institution)}
          className="p-2 rounded transition-all duration-200 hover:scale-105 text-[var(--color-primary)] bg-[var(--color-primary-light)]"
          title="Editar"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(institution)}
          className="p-2 rounded transition-all duration-200 hover:scale-105 text-[var(--color-error)] bg-[var(--color-error-light)]"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

/* ----------------------------
 *  Institutions Table
 * ---------------------------- */
const InstitutionsTable = memo(
  ({ institutions, onEdit, onDelete, isLoading = false }: InstitutionsTableProps) => {
    if (isLoading) return <LoadingState />;
    if (!institutions || institutions.length === 0) return <EmptyState />;

    return (
      <div className="rounded-xl shadow-sm border bg-card border-[var(--color-border)] overflow-y-hidden">
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="max-h-[calc(100vh-15rem)] overflow-y-auto scrollbar-none">
            <table className="min-w-full divide-y border-[var(--color-border)]">
              <thead className="sticky top-0 z-10 bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                    Institución
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y bg-card border-[var(--color-border)]">
                {institutions.map((institution, index) => (
                  <InstitutionRow
                    key={institution.id ?? `temp-${index}`}
                    institution={institution}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="max-h-[calc(100vh-22rem)] overflow-y-auto scrollbar-none divide-y border-[var(--color-border)]">
            {institutions.map((institution, index) => (
              <MobileInstitutionCard
                key={institution.id ?? `mobile-temp-${index}`}
                institution={institution}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);
InstitutionsTable.displayName = "InstitutionsTable";

export default InstitutionsTable;
