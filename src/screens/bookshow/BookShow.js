import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import Typography from "@material-ui/core/Typography";
import "./BookShow.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Link } from "react-router-dom";

const BookShow = (props) => {
  const [location, setLocation] = useState("");
  const [theatre, setTheatre] = useState("");
  const [language, setLanguage] = useState("");
  const [showDate, setShowDate] = useState("");
  const [tickets, setTickets] = useState(0);
  const [unitPrice, setUnitPrice] = useState(500);
  const [availableTickets, setAvailableTickets] = useState(20);
  const [reqLocation, setReqLocation] = useState("dispNone");
  const [reqTheatre, setReqTheatre] = useState("dispNone");
  const [reqLanguage, setReqLanguage] = useState("dispNone");
  const [reqShowDate, setReqShowDate] = useState("dispNone");
  const [reqTickets, setReqTickets] = useState("dispNone");
  const [locations, setLocations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [showDates, setShowDates] = useState([]);
  const [originalShows, setOriginalShows] = useState([]);
  const [showId, setShowId] = useState("");

  useEffect(() => {
    let dataShows = null;

    fetch(props.baseUrl + "movies/" + props.match.params.id + "/shows", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: dataShows,
    })
      .then((response) => response.json())
      .then((response) => {
        setOriginalShows(response.shows);

        let newLocations = [];

        for (let show of response.shows) {
          newLocations.push({
            id: show.theatre.city,
            location: show.theatre.city,
          });
        }

        newLocations = newLocations.filter(
          (loc, index, self) => index === self.findIndex((c) => c.id === loc.id)
        );
        setLocations(newLocations);
      });
  }, []);

  const locationChangeHandler = (event) => {
    setLocation(event.target.value);
    let newTheatres = [];

    for (let show of originalShows) {
      if (show.theatre.city === event.target.value) {
        newTheatres.push({ id: show.theatre.name, theatre: show.theatre.name });
      }
    }

    newTheatres = newTheatres.filter(
      (theatre, index, self) =>
        index === self.findIndex((t) => t.id === theatre.id)
    );

    setTheatres(newTheatres);
  };

  const theatreChangeHandler = (event) => {
    setTheatre(event.target.value);

    let newLanguages = [];

    for (let show of originalShows) {
      if (
        show.theatre.city === location &&
        show.theatre.name === event.target.value
      ) {
        newLanguages.push({ id: show.language, language: show.language });
      }
    }

    newLanguages = newLanguages.filter(
      (lang, index, self) => index === self.findIndex((l) => l.id === lang.id)
    );
    setLanguages(newLanguages);
  };

  const languageChangeHandler = (event) => {
    setLanguage(event.target.value);

    let newShowDates = [];

    for (let show of originalShows) {
      if (
        show.theatre.city === location &&
        show.theatre.name === theatre &&
        show.language === event.target.value
      ) {
        newShowDates.push({ id: show.show_timing, showDate: show.show_timing });
      }
    }

    newShowDates = newShowDates.filter(
      (date, index, self) => index === self.findIndex((d) => d.id === date.id)
    );
    setShowDates(newShowDates);
  };

  const showDateChangeHandler = (event) => {
    setShowDate(event.target.value);

    let unitPrice = 0;
    let availableTickets = 0;

    for (let show of originalShows) {
      if (
        show.theatre.city === location &&
        show.theatre.name === theatre &&
        show.language === language &&
        show.show_timing === event.target.value
      ) {
        unitPrice = show.unit_price;
        availableTickets = show.available_seats;
        setShowId(show.id);
      }
    }
    setAvailableTickets(availableTickets);
    setUnitPrice(unitPrice);
  };

  const ticketsChangeHandler = (event) => {
    setTickets(event.target.value.split(","));
  };

  const bookShowButtonHandler = () => {
    location === "" ? setReqLocation("dispBlock") : setReqLocation("dispNone");
    theatre === "" ? setReqTheatre("dispBlock") : setReqTheatre("dispNone");
    language === "" ? setReqLanguage("dispBlock") : setReqLanguage("dispNone");
    showDate === "" ? setReqShowDate("dispBlock") : setReqShowDate("dispNone");
    tickets === 0 ? setReqTickets("dispBlock") : setReqTickets("dispNone");

    if (
      location === "" ||
      theatre === "" ||
      language === "" ||
      showDate === "" ||
      tickets === 0
    ) {
      return;
    }

    props.history.push({
      pathname: "/confirm/" + props.match.params.id,
      bookingSummary: {
        location,
        theatre,
        language,
        showDate,
        tickets,
        unitPrice,
        availableTickets,
        reqLocation,
        reqTheatre,
        reqLanguage,
        reqShowDate,
        reqTickets,
        locations,
        languages,
        theatres,
        showDates,
        originalShows,
        showId,
      },
    });
  };

  return (
    <div>
      <Header baseUrl={props.baseUrl} />
      <div className="bookShow">
        <Typography className="back">
          <Link to={"/movie/" + props.match.params.id}>
            &#60; Back to Movie Details
          </Link>
        </Typography>

        <Card className="cardStyle">
          <CardContent>
            <Typography variant="headline" component="h2">
              BOOK SHOW
            </Typography>
            <br />

            <FormControl required className="formControl">
              <InputLabel htmlFor="location">Choose Location:</InputLabel>
              <Select value={location} onChange={locationChangeHandler}>
                {locations.map((loc) => (
                  <MenuItem key={"loc" + loc.id} value={loc.location}>
                    {loc.location}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText className={reqLocation}>
                <span className="red">Required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="theatre">Choose Theatre:</InputLabel>
              <Select value={theatre} onChange={theatreChangeHandler}>
                {theatres.map((th) => (
                  <MenuItem key={"theatre" + th.id} value={th.theatre}>
                    {th.theatre}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText className={reqTheatre}>
                <span className="red">Required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="language">Choose Language:</InputLabel>
              <Select value={language} onChange={languageChangeHandler}>
                {languages.map((lang) => (
                  <MenuItem key={"lang" + lang.id} value={lang.language}>
                    {lang.language}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText className={reqLanguage}>
                <span className="red">Required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="showDate">Choose Show Date:</InputLabel>
              <Select value={showDate} onChange={showDateChangeHandler}>
                {showDates.map((sd) => (
                  <MenuItem key={"showDate" + sd.id} value={sd.showDate}>
                    {sd.showDate}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText className={reqShowDate}>
                <span className="red">Required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required className="formControl">
              <InputLabel htmlFor="tickets">
                Seat Selection: ( {availableTickets} available )
              </InputLabel>
              <Input
                id="tickets"
                value={tickets !== 0 ? tickets : ""}
                onChange={ticketsChangeHandler}
              />
              <FormHelperText className={reqTickets}>
                <span className="red">Required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <Typography>Unit Price: Rs. {unitPrice}</Typography>
            <br />
            <Typography>
              Total Price: Rs. {unitPrice * tickets}
            </Typography>
            <br />
            <br />
            <Button
              variant="contained"
              onClick={bookShowButtonHandler}
              color="primary"
            >
              BOOK SHOW
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookShow;
