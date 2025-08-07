import { Edit, Trash2 } from 'lucide-react';
import { memo, useCallback } from 'react';
import type { Pump } from '../../../../../types';
import { BUTTON_STYLES, LAYOUT_STYLES, BORDER_STYLES, combineClasses } from '../shared/styles';

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
        <div className={`${LAYOUT_STYLES.flexEnd} ${LAYOUT_STYLES.spaceX3} pt-3 ${BORDER_STYLES.top}`}>
            <button
                onClick={handleEdit}
                className={combineClasses(
                    LAYOUT_STYLES.flexCenter,
                    BUTTON_STYLES.actionMobile,
                    BUTTON_STYLES.editMobile
                )}
            >
                <Edit size={16} className="mr-2" />
                Editar
            </button>
            <button
                onClick={handleDelete}
                className={combineClasses(
                    LAYOUT_STYLES.flexCenter,
                    BUTTON_STYLES.actionMobile,
                    BUTTON_STYLES.deleteMobile
                )}
            >
                <Trash2 size={16} className="mr-2" />
                Eliminar
            </button>
        </div>
    );
});

MobileActions.displayName = 'MobileActions';

export default MobileActions;
