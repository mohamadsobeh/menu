export const formatSYPPrice = (price: number): string => {
  if (isNaN(price)) return "غير محدد";

  
  return `${price.toLocaleString("en-US")} ل.س`;
};
