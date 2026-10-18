export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export function getNextOrderStatus(status: string): OrderStatus | null {
  switch (status) {
    case "pending":
      return "confirmed";
    case "confirmed":
      return "shipped";
    case "shipped":
      return "delivered";
    default:
      return null;
  }
}