import { Edit, Trash2 } from 'lucide-react';
import { memo, useCallback } from 'react';
import type { Pump } from '../../../../../types';
import Cell from './Cell';
import { BUTTON_STYLES, LAYOUT_STYLES, combineClasses } from './styles';

interface ActionsCellProps {
    item: Pump;
    onEdit: (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
    paddingSize?: 'compact' | 'normal' | 'comfortable';
}

const ActionsCell = memo(({
    item,
    onEdit,
    onDelete,
    paddingSize = 'normal'
}: ActionsCellProps) => {
    const handleEdit = useCallback(() => {
        onEdit(item);
    }, [onEdit, item]);

    const handleDelete = useCallback(() => {
        onDelete(item);
    }, [onDelete, item]);

    return (
        <Cell hasBorder={false} isCenter paddingSize={paddingSize}>
            <div className={`${LAYOUT_STYLES.flexCenter} ${LAYOUT_STYLES.spaceX1}`}>
                <button
                    onClick={handleEdit}
                    className={combineClasses(
                        BUTTON_STYLES.actionBase,
                        BUTTON_STYLES.actionDesktop,
                        BUTTON_STYLES.edit
                    )}
                    title="Editar equipo"
                >
                    <Edit size={12} className="lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4" />
                </button>
                <button
                    onClick={handleDelete}
                    className={combineClasses(
                        BUTTON_STYLES.actionBase,
                        BUTTON_STYLES.actionDesktop,
                        BUTTON_STYLES.delete
                    )}
                    title="Eliminar equipo"
                >
                    <Trash2 size={12} className="lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4" />
                </button>
            </div>
        </Cell>
    );
});

ActionsCell.displayName = 'ActionsCell';

export default ActionsCell;
