import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return;
  let cartItem = [];
  for (let i = 0; i < cartData.length; i++) {
    for (let j = 0; j < productsData.length; j++) {
      if (
        cartData[i].qty > 0 &&
        (cartData[i].productId === productsData[j]._id ||
          cartData[i]._id === productsData[j]._id)
      ) {
        productsData[j].qty = cartData[i].qty;
        cartItem.push(productsData[j]);
      }
    }
  }
  return cartItem;
};

export const getTotalCartValue = (items = []) => {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    let totalQty = items[i].qty;
    let totalCost = items[i].cost;
    let totalValue = totalCost * totalQty;
    total += totalValue;
  }
  return total;
};

export const getTotalItems = (items = []) => {
  return items.length;
};

const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  let history = useHistory();
  if (items.length === 0) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  } else {
    return (
      <>
        <Box className="cart">
          {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
          {items.map((e, inx) => {
            const token = localStorage.getItem("token");
            return (
              <Box
                display="flex"
                key={inx}
                alignItems="flex-start"
                padding="1rem"
              >
                <Box className="image-container">
                  <img
                    // Add product image
                    src={e.image}
                    // Add product name as alt text
                    alt={e.name}
                    width="100%"
                    height="100%"
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div>{e.name}</div>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {isReadOnly ? (
                      <p>Qty: {e.qty}</p>
                    ) : (
                      <ItemQuantity
                        value={e.qty}
                        handleAdd={() =>
                          handleQuantity(
                            localStorage.getItem("token"),
                            items,
                            products,
                            e._id,
                            e.qty ? e.qty + 1 : 1
                          )
                        }
                        handleDelete={() =>
                          handleQuantity(
                            localStorage.getItem("token"),
                            items,
                            products,
                            e._id,
                            e.qty ? e.qty - 1 : 1
                          )
                        }
                      />
                    )}
                    <Box padding="0.5rem" fontWeight="700">
                      ${e.cost}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          {!isReadOnly ? (
            <Box
              display="flex"
              justifyContent="flex-end"
              className="cart-footer"
            >
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
                onClick={() => {
                  history.push("/checkout");
                  // window.scrollTo(0, 0);
                }}
              >
                Checkout
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </>
    );
  }
};

export default Cart;
