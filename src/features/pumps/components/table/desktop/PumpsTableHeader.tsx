import { memo } from 'react';
import Cell from '../shared/Cell';
import { TABLE_COLUMNS } from '../shared/tableConfig';

const PumpsTableHeader = memo(() => {
    return (
        <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
                {TABLE_COLUMNS.map((column) => (
                    <Cell
                        key={column.key}
                        isHeader
                        isCenter={column.isCenter}
                        width={column.width}
                        children={column.title}
                        paddingSize="compact"
                    />
                ))}
            </tr>
        </thead>
    );
});

PumpsTableHeader.displayName = 'PumpsTableHeader';

export default PumpsTableHeader;
