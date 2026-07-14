import test from "node:test";
import assert from "node:assert/strict";
import {
  canTransitionOrderStatus,
  getAllowedOrderStatusTransitions,
} from "../src/constants/orderTransitions.js";

test("allows the supported order lifecycle transitions", () => {
  assert.equal(canTransitionOrderStatus("pending", "paid"), true);
  assert.equal(canTransitionOrderStatus("pending", "cancelled"), true);
  assert.equal(canTransitionOrderStatus("paid", "delivered"), true);
  assert.equal(canTransitionOrderStatus("paid", "cancelled"), true);
});

test("keeps repeated status notifications idempotent", () => {
  assert.equal(canTransitionOrderStatus("pending", "pending"), true);
  assert.equal(canTransitionOrderStatus("paid", "paid"), true);
  assert.equal(canTransitionOrderStatus("cancelled", "cancelled"), true);
  assert.equal(canTransitionOrderStatus("delivered", "delivered"), true);
});

test("rejects backward or terminal-state transitions", () => {
  assert.equal(canTransitionOrderStatus("delivered", "pending"), false);
  assert.equal(canTransitionOrderStatus("delivered", "cancelled"), false);
  assert.equal(canTransitionOrderStatus("cancelled", "paid"), false);
  assert.equal(canTransitionOrderStatus("paid", "pending"), false);
});

test("returns only the current and valid next statuses", () => {
  assert.deepEqual(getAllowedOrderStatusTransitions("pending"), [
    "pending",
    "paid",
    "cancelled",
  ]);
  assert.deepEqual(getAllowedOrderStatusTransitions("paid"), [
    "paid",
    "delivered",
    "cancelled",
  ]);
  assert.deepEqual(getAllowedOrderStatusTransitions("delivered"), ["delivered"]);
});
