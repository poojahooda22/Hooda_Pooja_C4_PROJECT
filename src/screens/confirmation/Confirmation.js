import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import "./Confirmation.css";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import green from "@material-ui/core/colors/green";
import { Link } from "react-router-dom";

const styles = (theme) => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  success: {
    color: green[600],
  },
});

const Confirmation = (props) => {
  const [open, setOpen] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalTotalPrice, setOriginalTotalPrice] = useState(0);

  useEffect(() => {
    const price =
      parseInt(props.location.bookingSummary.unitPrice, 10) *
      parseInt(props.location.bookingSummary.tickets, 10);
    setTotalPrice(price);
    setOriginalTotalPrice(price);
  }, []);

  const confirmBookingHandler = () => {
    let data = JSON.stringify({
      coupon_code: couponCode,
      show_id: props.location.bookingSummary.showId,
      tickets: [props.location.bookingSummary.tickets.toString()],
    });

    fetch(props.baseUrl + "bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + sessionStorage.getItem("access-token"),
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setBookingId(data.reference_number);
      });

    setOpen(true);
  };

  const snackBarCloseHandler = () => {
    props.history.push("/");
  };

  const couponCodeChangeHandler = (e) => {
    setCouponCode(e.target.value);
  };

  const couponApplyHandler = () => {
    fetch(props.baseUrl + "movies/" + props.match.params.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: "Bearer " + sessionStorage.getItem("access-token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let discountValue = data.value;
        if (discountValue !== undefined && discountValue > 0) {
          setTotalPrice(
            originalTotalPrice - (originalTotalPrice * discountValue) / 100
          );
        } else {
          setTotalPrice(originalTotalPrice);
        }
      });
  };

  const { classes } = props;

  return (
    <div className="Details">
      <Header />

      <div className="confirmation marginTop16">
        <div>
          <Link to={"/bookshow/" + props.match.params.id}>
            <Typography className="back">&#60; Back to Book Show</Typography>
          </Link>
          <br />

          <Card className="cardStyle">
            <CardContent>
              <Typography variant="headline" component="h2">
                SUMMARY
              </Typography>
              <br />

              <div className="coupon-container">
                <div className="confirmLeft">
                  <Typography>Location:</Typography>
                </div>
                <div>
                  <Typography>
                    {props.location.bookingSummary.location}
                  </Typography>
                </div>
              </div>
              <br />

              <div className="coupon-container">
                <div className="confirmLeft">
                  <Typography>Theatre:</Typography>
                </div>
                <div>
                  <Typography>
                    {props.location.bookingSummary.theatre}
                  </Typography>
                </div>
              </div>
              <br />

              <div className="coupon-container">
                <div className="confirmLeft">
                  <Typography>Language:</Typography>
                </div>
                <div>
                  <Typography>
                    {props.location.bookingSummary.language}
                  </Typography>
                </div>
              </div>
              <br />

              <div className="coupon-container">
                <div className="confirmLeft">
                  <Typography>Show Date:</Typography>
                </div>
                <div>
                  <Typography>
                    {props.location.bookingSummary.showDate}
                  </Typography>
                </div>
              </div>
              <br />

              <div className="coupon-container">
                <div className="confirmLeft">
                  <Typography>Tickets:</Typography>
                </div>
                <div>
                  <Typography>
                    {props.location.bookingSummary.tickets.toString()}
                  </Typography>
                </div>
              </div>
              <br />

              <div className="coupon-container">
                <div className="confirmLeft">
                  <Typography>Unit Price:</Typography>
                </div>
                <div>
                  <Typography>
                    {props.location.bookingSummary.unitPrice}
                  </Typography>
                </div>
              </div>
              <br />

              <div className="coupon-container">
                <div>
                  <FormControl className="formControl">
                    <InputLabel htmlFor="coupon">
                      <Typography>Coupon Code</Typography>
                    </InputLabel>
                    <Input id="coupon" onChange={couponCodeChangeHandler} />
                  </FormControl>
                </div>
                <div className="marginApply">
                  <Button
                    variant="contained"
                    onClick={couponApplyHandler}
                    color="primary"
                  >
                    Apply
                  </Button>
                </div>
              </div>
              <br />
              <br />

              <div className="coupon-container">
                <div className="confirmLeft">
                  <span className="bold">Total Price:</span>
                </div>
                <div>{parseInt(totalPrice, 10)}</div>
              </div>
              <br />

              <Button
                variant="contained"
                onClick={confirmBookingHandler}
                color="primary"
              >
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        className="snackbar"
        open={open}
        onClose={snackBarCloseHandler}
        message={
          <span id="client-snackbar" className={classes.success}>
            <div className="confirm">
              <div>
                <CheckCircleIcon />
              </div>
              <div className="message"> Booking Confirmed! {bookingId}</div>
            </div>
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={snackBarCloseHandler}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
};

Confirmation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Confirmation);
