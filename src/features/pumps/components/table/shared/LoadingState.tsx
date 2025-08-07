import { memo } from 'react';
import { LAYOUT_STYLES, TEXT_STYLES } from './styles';

interface LoadingStateProps {
    message?: string;
}

const LoadingState = memo(({ message = "Cargando bombas..." }: LoadingStateProps) => {
    return (
        <div className={`${LAYOUT_STYLES.flexCenter} ${LAYOUT_STYLES.statesPadding}`}>
            <div className={LAYOUT_STYLES.centerContainer}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className={TEXT_STYLES.textGray600}>{message}</p>
            </div>
        </div>
    );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
