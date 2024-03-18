import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout"
import { ThemeProvider } from "@emotion/react";
import theme  from './theme';
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Thanks from "./components/Thanks"

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    
    <React.StrictMode>
      <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Products}/>
            <Route path="/register" component={Register}/>
            <Route path="/login" component={Login}/>
            <Route path="/checkout" component={Checkout}/>
            <Route path="/thanks" component={Thanks}/>
          </Switch>
          {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          {/* <Register /> */}
          {/* <Login /> */}
        </div>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode> 
    
    
  );
}

export default App;
