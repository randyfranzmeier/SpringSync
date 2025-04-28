
export function validateNumericInputs(value, minVal, maxVal) {
    if (!value) {
        return false;
    }
    
   return value >= minVal && value <= maxVal;
}
