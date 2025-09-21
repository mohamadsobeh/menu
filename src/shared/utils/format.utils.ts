export const formatSYPPrice = (price: number): string => {
  if (price >= 1000000) {
    const millions = Math.floor(price / 1000000);
    const remainder = price % 1000000;
    
    if (remainder === 0) {
      return `${millions} مليون ل.س`;
    } else if (remainder >= 1000) {
      const thousands = Math.floor(remainder / 1000);
      const finalRemainder = remainder % 1000;
      
      if (finalRemainder === 0) {
        return `${millions} مليون و ${thousands} الف ل.س`;
      } else {
        return `${millions} مليون و ${thousands} الف و ${finalRemainder} ل.س`;
      }
    } else {
      return `${millions} مليون و ${remainder} ل.س`;
    }
  } else if (price >= 1000) {
    const thousands = Math.floor(price / 1000);
    const remainder = price % 1000;
    
    if (remainder === 0) {
      return `${thousands} الف ل.س`;
    } else {
      return `${thousands} الف و ${remainder} ل.س`;
    }
  }
  
  return `${price} ل.س`;
};
