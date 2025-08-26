import { Edit, Trash2 } from 'lucide-react';
import { memo, useCallback } from 'react';
import type { Pump } from '../../../../../types';

interface MobileActionsProps {
    item: Pump;
    onEdit: (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
}

const MobileActions = memo(({
    item,
    onEdit,
    onDelete
}: MobileActionsProps) => {
    const handleEdit = useCallback(() => {
        onEdit(item);
    }, [onEdit, item]);

    const handleDelete = useCallback(() => {
        onDelete(item);
    }, [onDelete, item]);

    return (
        <div 
            className="flex justify-end space-x-3 pt-3 border-t"
            style={{ borderTopColor: 'var(--color-border)' }}
        >
            <button
                onClick={handleEdit}
                className="flex items-center justify-center px-4 py-2 text-sm border rounded-lg transition-colors duration-150"
                style={{
                    color: 'var(--color-info)',
                    borderColor: 'var(--color-info-light)',
                    backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-info-light)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                <Edit size={16} className="mr-2" />
                Editar
            </button>
            <button
                onClick={handleDelete}
                className="flex items-center justify-center px-4 py-2 text-sm border rounded-lg transition-colors duration-150"
                style={{
                    color: 'var(--color-error)',
                    borderColor: 'var(--color-error-light)',
                    backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-error-light)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                <Trash2 size={16} className="mr-2" />
                Eliminar
            </button>
        </div>
    );
});

MobileActions.displayName = 'MobileActions';

export default MobileActions;
