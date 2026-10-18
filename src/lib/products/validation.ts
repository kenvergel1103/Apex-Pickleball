export const MAX_PRODUCT_PRICE = 99_999_999.99;
export const MAX_PRODUCT_STOCK = 2_147_483_647;

export function isValidProductPrice(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= MAX_PRODUCT_PRICE &&
    /^\d+(?:\.\d{1,2})?$/.test(String(value))
  );
}

export function isValidProductStock(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= MAX_PRODUCT_STOCK
  );
}
