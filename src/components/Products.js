import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { Typography } from "@mui/material";
import Cart, { generateCartItemsFrom } from "./Cart";
import "./Cart.css";
import { Warning } from "@mui/icons-material";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]); //all products list
  const [loading, setLoading] = useState(false);
  const [cartItemList, setCartItemList] = useState([]); //cart list
  const [cartItemId, setCartItemId] = useState([]);
  let token = localStorage.getItem("token");

  const performAPICall = async () => {
    setLoading(true);
    try {
      const url = `${config.endpoint}/products`;
      let response = await axios.get(url);
      setProducts(response.data);
      console.log(response.data);
      setLoading(false);
      return response.data;
    } catch (e) {
      // setLoading(false);
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const performSearch = async (text) => {
    let url = `${config.endpoint}/products/search?value=${text}`;
    try {
      let search = await axios.get(url);
      setProducts(search.data);
    } catch (e) {
      if (e.response.status === 404) {
        setProducts("empty");
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    let newtimeout;
    clearTimeout(newtimeout);
    newtimeout = setTimeout(() => {
      performSearch(event.target.value);
    }, debounceTimeout);
  };

  useEffect(() => {
    // const defaultFunction = async () => {
    performAPICall();

    //  defaultFunction();
  }, []);

  useEffect(() => {
    // if (token) {
    // console.log(token)
    fetchCart(token)
      .then((result) => {
        return generateCartItemsFrom(result, products);
      })
      .then((cartItems) => {
        return setCartItemList(cartItems);
      });
    // }
  }, [products]);

  // useEffect(() => {
  //   console.log("itemList.pdt", cartItemList);
  // }, [cartItemList]);

  const fetchCart = async (token) => {
    // console.log("2")
    if (!token) return;
    const url = `${config.endpoint}/cart`;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const isItemInCart = (items, productId) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === productId) {
        return true;
      }
    }
    return false;
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add item to the Cart", { variant: "Warning" });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }

    try {
      const res = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const nCartItemList = generateCartItemsFrom(res.data, products);
      setCartItemId(res.data);
      setCartItemList(nCartItemList);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          fullWidth
          size="small"
          sx={{ width: "35%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => debounceSearch(event, 500)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event) => debounceSearch(event, 500)}
      />
      <Grid container>
        <Grid
          item
          // container
          // direction="row"
          // justifyContent="center"
          // alignItems="center"
          xs
          md
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {/* <ProductCard /> */}

          <Grid container>
            {loading === true ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress size={25} />
                <Typography gutterBottom variant="p" component="div">
                  Loading Products...
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                item
                spacing={1}
                direction="row"
                justifyContent="center"
                alignItems="center"
                my={3}
              >
                {products !== "empty" ? (
                  products.map((item) => (
                    <Grid item key={item._id} xs={6} md={3}>
                      <ProductCard
                        product={item}
                        handleAddToCart={async () => {
                          const token = localStorage.getItem("token");
                          await addToCart(
                            token,
                            cartItemList,
                            products,
                            item._id,
                            1,
                            { preventDuplicate: true }
                          );
                        }}
                      />
                    </Grid>
                  ))
                ) : (
                  <h3>No products found</h3>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
        {localStorage.token && (
          <Grid
            container
            item
            className="product-grid"
            xs={12}
            md={3}
            sx={{ border: `1px solid black`, backgroundColor: `#E9F5E1` }}
          >
            <Cart
              products={products}
              items={cartItemList}
              handleQuantity={addToCart}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};
// return(<productCard/>)

export default Products;
