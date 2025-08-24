import { memo, useCallback } from "react";
import { Edit, Trash2, Settings } from "lucide-react";
import type { ServiceExtended } from "../types";

interface ServicesTableProps {
  services: ServiceExtended[];
  onEdit: (service: ServiceExtended) => void;
  onDelete: (service: ServiceExtended) => void;
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
    <Settings className="mx-auto h-12 w-12 text-muted" />
    <h3 className="mt-2 text-sm font-medium text-primary">No hay servicios</h3>
    <p className="mt-1 text-sm text-secondary">
      Comienza agregando un nuevo servicio.
    </p>
  </div>
);

/* ----------------------------
 *  Desktop Row
 * ---------------------------- */
const ServiceRow = memo(
  ({
    service,
    onEdit,
    onDelete,
  }: {
    service: ServiceExtended;
    onEdit: (service: ServiceExtended) => void;
    onDelete: (service: ServiceExtended) => void;
  }) => {
    const handleEdit = useCallback(() => onEdit(service), [onEdit, service]);
    const handleDelete = useCallback(() => onDelete(service), [onDelete, service]);

    return (
      <tr className="hover:bg-gray-50 transition-colors bg-card">
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm font-medium text-primary">{service.name}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleEdit}
              className="p-1 rounded transition-all duration-200 hover:scale-105 text-[var(--color-primary)] bg-[var(--color-primary-light)]"
              title="Editar servicio"
              aria-label={`Editar ${service.name}`}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded transition-all duration-200 hover:scale-105 text-[var(--color-error)] bg-[var(--color-error-light)]"
              title="Eliminar servicio"
              aria-label={`Eliminar ${service.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);
ServiceRow.displayName = "ServiceRow";

/* ----------------------------
 *  Mobile Card
 * ---------------------------- */
const MobileServiceCard = ({
  service,
  onEdit,
  onDelete,
}: {
  service: ServiceExtended;
  onEdit: (service: ServiceExtended) => void;
  onDelete: (service: ServiceExtended) => void;
}) => (
  <div className="p-4 space-y-3 hover:bg-gray-50 transition-colors bg-card">
    <div className="flex justify-between items-start">
      <h3 className="text-sm font-medium text-primary">{service.name}</h3>
      <div className="flex space-x-2 ml-4">
        <button
          onClick={() => onEdit(service)}
          className="p-2 rounded transition-all duration-200 hover:scale-105 text-[var(--color-primary)] bg-[var(--color-primary-light)]"
          title="Editar"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(service)}
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
 *  Services Table
 * ---------------------------- */
const ServicesTable = memo(
  ({ services, onEdit, onDelete, isLoading = false }: ServicesTableProps) => {
    if (isLoading) return <LoadingState />;
    if (!services || services.length === 0) return <EmptyState />;

    return (
      <div className="rounded-xl shadow-sm border bg-card border-[var(--color-border)] overflow-x-hidden">
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="max-h-[calc(100vh-15rem)] overflow-y-auto scrollbar-none">
            <table className="min-w-full divide-y border-[var(--color-border)]">
              <thead className="sticky top-0 z-10 bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y bg-card border-[var(--color-border)]">
                {services.map((service, index) => (
                  <ServiceRow
                    key={service.id ?? `temp-${index}`}
                    service={service}
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
            {services.map((service, index) => (
              <MobileServiceCard
                key={service.id ?? `mobile-temp-${index}`}
                service={service}
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
ServicesTable.displayName = "ServicesTable";

export default ServicesTable;
