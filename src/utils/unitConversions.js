/**
 * Converts weight to the specified unit system.
 * @param {number} weightInLbs - Weight in pounds (LBS).
 * @param {string} unitSystem - Target unit system ('LBS' or 'KG').
 * @returns {number} - Converted weight rounded to the nearest integer.
 */
export const displayWeight = (weightInLbs, unitSystem) => {
    if (unitSystem === 'KG') {
        return Math.round(weightInLbs * 0.453592);
    }
    return weightInLbs;
};
