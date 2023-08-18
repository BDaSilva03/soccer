// This utility function normalizes a given text to a standard format for easy comparison.

export const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};
