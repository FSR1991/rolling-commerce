import { ORDER_STATUSES } from "./orderStatuses.js";

const ORDER_STATUS_TRANSITIONS = Object.freeze({
  pending: Object.freeze(["paid", "cancelled"]),
  paid: Object.freeze(["delivered", "cancelled"]),
  cancelled: Object.freeze([]),
  delivered: Object.freeze([]),
});

const canTransitionOrderStatus = (currentStatus, nextStatus) => {
  if (!ORDER_STATUSES.includes(currentStatus) || !ORDER_STATUSES.includes(nextStatus)) {
    return false;
  }

  if (currentStatus === nextStatus) {
    return true;
  }

  return ORDER_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};

const getAllowedOrderStatusTransitions = (currentStatus) => {
  if (!ORDER_STATUSES.includes(currentStatus)) {
    return [];
  }

  return [currentStatus, ...ORDER_STATUS_TRANSITIONS[currentStatus]];
};

export {
  ORDER_STATUS_TRANSITIONS,
  canTransitionOrderStatus,
  getAllowedOrderStatusTransitions,
};
