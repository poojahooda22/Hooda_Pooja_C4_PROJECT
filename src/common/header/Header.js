import React from "react";
import Logo from "../../assets/logo.svg";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import { useState } from "react";
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";

import "./Header.css";
import { Link } from "react-router-dom";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

function Header(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [usernameRequired, setUsernameRequired] = useState("dispNone");
  const [username, setUsername] = useState("");
  const [loginPasswordRequired, setLoginPasswordRequired] =
    useState("dispNone");
  const [loginPassword, setLoginPassword] = useState("");
  const [firstnameRequired, setFirstnameRequired] = useState("dispNone");
  const [firstname, setFirstname] = useState("");
  const [lastnameRequired, setLastnameRequired] = useState("dispNone");
  const [lastname, setLastname] = useState("");
  const [emailRequired, setEmailRequired] = useState("dispNone");
  const [email, setEmail] = useState("");
  const [registerPasswordRequired, setRegisterPasswordRequired] =
    useState("dispNone");
  const [registerPassword, setRegisterPassword] = useState("");
  const [contactRequired, setContactRequired] = useState("dispNone");
  const [contact, setContact] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("access-token") == null ? false : true
  );

  const openModalHandler = () => {
    setModalIsOpen(true);
    setValue(0);
    setUsernameRequired("dispNone");
    setUsername("");
    setLoginPasswordRequired("dispNone");
    setLoginPassword("");
    setFirstnameRequired("dispNone");
    setFirstname("");
    setLastnameRequired("dispNone");
    setLastname("");
    setEmailRequired("dispNone");
    setEmail("");
    setRegisterPasswordRequired("dispNone");
    setRegisterPassword("");
    setContactRequired("dispNone");
    setContact("");
  };

  const closeModalHandler = () => {
    setModalIsOpen(false);
  };

  const tabChangeHandler = (event, value) => {
    setValue(value);
  };

  const loginClickHandler = async () => {
    try {
      username === ""
        ? setUsernameRequired("dispBlock")
        : setUsernameRequired("dispNone");
      loginPassword === ""
        ? setLoginPasswordRequired("dispBlock")
        : setLoginPasswordRequired("dispNone");

      const response = await fetch(`${props.baseUrl}auth/login`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${window.btoa(`${username}:${loginPassword}`)}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        sessionStorage.setItem("uuid", data.id);
        sessionStorage.setItem(
          "access-token",
          response.headers.get("access-token")
        );
        setLoggedIn(true);
        closeModalHandler();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputUsernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const inputLoginPasswordChangeHandler = (event) => {
    setLoginPassword(event.target.value);
  };

  const registerClickHandler = async () => {
    try {
      firstname === ""
        ? setFirstnameRequired("dispBlock")
        : setFirstnameRequired("dispNone");

      lastname === ""
        ? setLastnameRequired("dispBlock")
        : setLastnameRequired("dispNone");

      email === ""
        ? setEmailRequired("dispBlock")
        : setEmailRequired("dispNone");
      registerPassword === ""
        ? setRegisterPasswordRequired("dispBlock")
        : setRegisterPasswordRequired("dispNone");
      contact === ""
        ? setContactRequired("dispBlock")
        : setContactRequired("dispNone");

      if (email && firstname && lastname && contact && registerPassword) {
        const dataSignup = JSON.stringify({
          email_address: email,
          first_name: firstname,
          last_name: lastname,
          mobile_number: contact,
          password: registerPassword,
        });

        const response = await fetch(`${props.baseUrl}signup`, {
          method: "POST",
          body: dataSignup,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201) {
          setRegistrationSuccess(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputFirstNameChangeHandler = (event) => {
    setFirstname(event.target.value);
  };

  const inputLastNameChangeHandler = (event) => {
    setLastname(event.target.value);
  };

  const inputEmailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const inputRegisterPasswordChangeHandler = (event) => {
    setRegisterPassword(event.target.value);
  };

  const inputContactChangeHandler = (event) => {
    setContact(event.target.value);
  };

  const logoutHandler = (event) => {
    sessionStorage.removeItem("uuid");
    sessionStorage.removeItem("access-token");

    setLoggedIn(false);
  };

  return (
    <div>
      <header className="app-header">
        <img src={Logo} className="app-logo" alt="Movies App Logo" />
        {!loggedIn ? (
          <div className="login-button">
            <Button
              variant="contained"
              color="default"
              onClick={openModalHandler}
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="login-button">
            <Button variant="contained" color="default" onClick={logoutHandler}>
              Logout
            </Button>
          </div>
        )}
        {props.showBookShowButton && !loggedIn ? (
          <div className="bookshow-button">
            <Button
              variant="contained"
              color="primary"
              onClick={openModalHandler}
            >
              Book Show
            </Button>
          </div>
        ) : (
          ""
        )}

        {props.showBookShowButton && loggedIn ? (
          <div className="bookshow-button">
            <Link to={"/bookshow/" + props.id}>
              <Button variant="contained" color="primary">
                Book Show
              </Button>
            </Link>
          </div>
        ) : (
          ""
        )}
      </header>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        contentLabel="Login"
        onRequestClose={closeModalHandler}
        style={customStyles}
      >
        <Tabs className="tabs" value={value} onChange={tabChangeHandler}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {value === 0 && (
          <TabContainer>
            <FormControl required>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                type="text"
                username={username}
                onChange={inputUsernameChangeHandler}
              />
              <FormHelperText className={usernameRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="loginPassword">Password</InputLabel>
              <Input
                id="loginPassword"
                type="password"
                loginpassword={loginPassword}
                onChange={inputLoginPasswordChangeHandler}
              />
              <FormHelperText className={loginPasswordRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            {loggedIn === true && (
              <FormControl>
                <span className="successText">Login Successful!</span>
              </FormControl>
            )}
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={loginClickHandler}
            >
              LOGIN
            </Button>
          </TabContainer>
        )}

        {value === 1 && (
          <TabContainer>
            <FormControl required>
              <InputLabel htmlFor="firstname">First Name</InputLabel>
              <Input
                id="firstname"
                type="text"
                firstname={firstname}
                onChange={inputFirstNameChangeHandler}
              />
              <FormHelperText className={firstnameRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="lastname">Last Name</InputLabel>
              <Input
                id="lastname"
                type="text"
                lastname={lastname}
                onChange={inputLastNameChangeHandler}
              />
              <FormHelperText className={lastnameRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                type="text"
                email={email}
                onChange={inputEmailChangeHandler}
              />
              <FormHelperText className={emailRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="registerPassword">Password</InputLabel>
              <Input
                id="registerPassword"
                type="password"
                registerpassword={registerPassword}
                onChange={inputRegisterPasswordChangeHandler}
              />
              <FormHelperText className={registerPasswordRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required>
              <InputLabel htmlFor="contact">Contact No.</InputLabel>
              <Input
                id="contact"
                type="text"
                contact={contact}
                onChange={inputContactChangeHandler}
              />
              <FormHelperText className={contactRequired}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            {registrationSuccess === true && (
              <FormControl>
                <span className="successText">
                  Registration Successful. Please Login!
                </span>
              </FormControl>
            )}
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={registerClickHandler}
            >
              REGISTER
            </Button>
          </TabContainer>
        )}
      </Modal>
    </div>
  );
}

export default Header;