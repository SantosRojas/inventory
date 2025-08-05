export const getPercentage = (partial?: number, total?: number): string | null => {
    return partial && total ? ((partial / total) * 100).toFixed(1) : null;
};
