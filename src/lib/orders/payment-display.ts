export type OrderPaymentMethod = "online" | "cash_on_delivery";

export function getPaymentDisplay(
  method: OrderPaymentMethod,
  status: string,
) {
  const methodLabel =
    method === "cash_on_delivery" ? "Cash on delivery" : "Online";

  let collectionLabel: string;

  if (method === "cash_on_delivery") {
    collectionLabel =
      status === "unpaid"
        ? "Due on delivery"
        : status === "paid"
          ? "Collected"
          : status === "refunded"
            ? "Refunded"
            : "Needs review";
  } else {
    collectionLabel =
      status === "paid"
        ? "Collected"
        : status === "refunded"
          ? "Refunded"
          : "Not collected";
  }

  return {
    methodLabel,
    collectionLabel,
    listLabel: `${methodLabel} · ${
      method === "cash_on_delivery" && collectionLabel === "Due on delivery"
        ? "due"
        : collectionLabel.toLowerCase()
    }`,
  };
}
