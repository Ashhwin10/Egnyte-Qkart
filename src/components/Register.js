import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useReducer } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const ACTIONS = {
  SET_DATA: "set-data",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_DATA:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);

  const [state, dispatch] = useReducer(reducer, {
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: ACTIONS.SET_DATA, payload: { [name]: value } });
  };

  const register = async () => {
    const { username, password, confirmPassword } = state;
    if (!validateInput(state)) {
      return;
    }

    try {
      setLoading(true);
      const url = `${config.endpoint}/auth/register`;
      await axios.post(url, {
        username,
        password,
      });
      setLoading(false);

      dispatch({
        type: ACTIONS.SET_DATA,
        payload: { username: "", password: "", confirmpassword: "" },
      });

      enqueueSnackbar("Registered Successfully", { variant: "success" });
      history.push("/login");
    } catch (e) {
      setLoading(false);
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

  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (data.username.length < 6) {
      enqueueSnackbar("Username must be more than 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("Password must be more than 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }
    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be at least 6 characters long"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={handleChange}
          />
          {loading ? (
            <CircularProgress
              size={25}
              style={{ margin: "16px auto 0", marginTop: "20px" }}
            />
          ) : (
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
