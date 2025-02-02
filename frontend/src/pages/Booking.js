import React, { useEffect, useState } from "react";
import ContentBox from "../components/StaffSection/ContentBox";
import axios from "axios";
// redux
import { connect } from "react-redux";
import {
  saveBookings,
  filterByCompleted,
  filterByPending,
} from "../redux/bookings/bookingAction";
//urls
import { api } from "../assets/URLS";
// Component & Svg
import Entry from "../components/Booking/Entry";
import Loading from "../components/Loading";
import { check, rsvg, searchSvg, x } from "../assets/images/SVG";
import search from "../assets/images/View/svg/search-3.svg";

function Booking({
  bookings,
  filteredBookings,
  saveBookings,
  filterByCompleted,
  filterByPending,
}) {
  const [name, setName] = useState("");
  const [filterby, setFilterby] = useState("all");
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [warn, setWarn] = useState(false);
  const [error, setError] = useState(false);

  const [matchedData, setMatchedData] = useState([]);

  // SEARCH FUNCTIONALITY
  const searching = (event) => {
    event.preventDefault();
    let text = event.target.value.toLowerCase();
    const allBookings = filterby === "all" ? bookings : filteredBookings;

    let matches = allBookings.filter((data) => {
      const regex = new RegExp(`^${text}.*$`);
      return (
        data.guest.name.toLowerCase().match(regex) ||
        data.guest.contact.match(regex) ||
        data.room.toString().match(regex)
      );
    });

    if (text === "") {
      setMatchedData([]);
    } else {
      setMatchedData(matches);
    }
  };

  // NOTIFY IF CHECK-IN SUCCESSFULLY DONE
  const notifyforCheckout = () => {
    setTimeout(() => {
      setCheckout(false);
    }, 3000);
    setCheckout(true);
  };
  // NOTIFY IF CHECK-IN SUCCESSFULLY DONE
  const notifyForConfirm = () => {
    setTimeout(() => {
      setConfirmed(false);
    }, 3000);
    setConfirmed(true);
  };
  // NOTIFY IF CANCELATION SUCCESSFULLY DONE
  const notifyForCancel = () => {
    setTimeout(() => {
      setCanceled(false);
    }, 3000);
    setCanceled(true);
  };
  // NOTIFY IF ERROR
  const notifyForError = () => {
    setTimeout(() => {
      setError(false);
    }, 3000);
    setError(true);
  };
  // NOTIFY FOR CHECKOUT FAIL
  const notifyForCheoutFailure = () => {
    setTimeout(() => {
      setWarn(false);
    }, 3000);
    setWarn(true);
  };

  // FILTER BY COMPLETE
  const filterOrderListByComplete = () => {
    setFilterby("co");
    filterByCompleted();
  };
  // FILTER PENDING ORDERS
  const filterOrderListByPending = () => {
    setFilterby("pe");
    filterByPending();
  };
  // FETCH BOOKING TABLE
  useEffect(() => {
    setLoading(true);
    const REFRESH_TOKEN = localStorage.getItem("refresh_token");
    const GET_ACCESS_TOKEN_URL = api.refresh;
    const BOOKING_TABLE_URL = api.booking_table;

    axios
      .post(GET_ACCESS_TOKEN_URL, { refresh: REFRESH_TOKEN })
      .then((token) => {
        const Config = {headers: { Authorization: "Bearer " + token.data.access }};

        axios
          .get(BOOKING_TABLE_URL, Config)
          .then((res) => {
            saveBookings(res.data);
            setLoading(false);
          })
          .catch(() => {
            console.clear();
            setLoading(false);
          });
      })
      .catch(() => {
        console.clear();
      });
  }, []);

  return (
    <ContentBox heading="Bookings">
      <div className="bookingPage">
        {/* search field */}
        <div className="search-field">
          <form onSubmit={searching}>
            <div className="icon">{searchSvg}</div>
            <input
              type="text"
              placeholder="Search by #name or #contact number or #room number"
              // value={name}
              onChange={(e) => searching(e)}
            />
          </form>
        </div>
        {/* filter options */}
        <div className="filter-by-type">
          <div
            className={filterby === "all" ? "active" : ""}
            onClick={() => {
              setFilterby("all");
            }}
          >
            All
          </div>
          <div
            className={filterby === "pe" ? "active" : ""}
            onClick={filterOrderListByPending}
          >
            Pending
          </div>
          <div
            className={filterby === "co" ? "active" : ""}
            onClick={filterOrderListByComplete}
          >
            Staying
          </div>
        </div>
        {/* table heading */}
        <div className="table-heading">
          <div className="no">Room {rsvg}</div>
          <div className="guest-name">Guest Name{rsvg}</div>
          <div className="status">Status {rsvg}</div>
          <div className="bookon">Contact{rsvg}</div>
          <div className="checkin">Check-in{rsvg}</div>
          <div className="checkout">Check-out{rsvg}</div>
          <div className="func">Confirm{rsvg}</div>
        </div>
        {/* search result */}
        {matchedData.length > 0 ? (
          <div className="result">
            {matchedData.map((entry) => (
              <Entry
                key={entry.id}
                bookingId={entry.id}
                room={entry.room}
                guest={entry.guest}
                check_in={entry.check_in}
                check_out={entry.check_out}
                is_active={entry.is_active}
                is_cancel={entry.is_canceled}
                notifyforCheckout={notifyforCheckout}
                notifyForCancel={notifyForCancel}
                notifyForConfirm={notifyForConfirm}
                notifyForError={notifyForError}
                notifyForCheoutFailure={notifyForCheoutFailure}
              />
            ))}
          </div>
        ) : null}
        {/* table entries */}
        {!loading ? (
          filterby !== "all" ? (
            filteredBookings.length > 0 ? (
              filteredBookings &&
              filteredBookings.map((entry) => (
                <Entry
                  key={entry.id}
                  bookingId={entry.id}
                  room={entry.room}
                  guest={entry.guest}
                  check_in={entry.check_in}
                  check_out={entry.check_out}
                  is_active={entry.is_active}
                  is_cancel={entry.is_canceled}
                  notifyforCheckout={notifyforCheckout}
                  notifyForCancel={notifyForCancel}
                  notifyForConfirm={notifyForConfirm}
                  notifyForError={notifyForError}
                  notifyForCheoutFailure={notifyForCheoutFailure}
                />
              ))
            ) : (
              <div className="empty">
                <img src={search} alt="" />
                <h2>Not available</h2>
              </div>
            )
          ) : bookings.length > 0 ? (
            bookings &&
            bookings.map((entry) => (
              <Entry
                key={entry.id}
                bookingId={entry.id}
                room={entry.room}
                guest={entry.guest}
                check_in={entry.check_in}
                check_out={entry.check_out}
                book_on={entry.booked_on}
                is_active={entry.is_active}
                notifyforCheckout={notifyforCheckout}
                notifyForCancel={notifyForCancel}
                notifyForConfirm={notifyForConfirm}
                notifyForError={notifyForError}
                notifyForCheoutFailure={notifyForCheoutFailure}
              />
            ))
          ) : (
            <div className="empty">
              <img src={search} alt="" />
              <h2>Not available</h2>
            </div>
          )
        ) : (
          <Loading height="60vh" width="100%" textSize="15px" space="6px" />
        )}
        {/* success message */}
        <div className={confirmed ? "message confirm" : "message confirm disabled"}>
          <div>{check}</div> Successfully Confirmed!
        </div>
        <div className={canceled ? "message cancel" : "message cancel disabled"}>
          <div>{check}</div> Successfully Canceled!
        </div>
        <div className={checkout ? "message confirm" : "message confirm disabled"}>
          <div>{check}</div> Checkout Successfull!
        </div>
        <div className={error ? "message error" : "message error disabled"}>
          <div>{x}</div> Can't Check-in Today!
        </div>
        <div className={warn ? "message error" : "message error disabled"}>
          <div>{x}</div> Payment not completed yet!
        </div>
      </div>
    </ContentBox>
  );
}

const mapStateToProps = (state) => {
  return {
    bookings: state.bookings.bookings,
    filteredBookings: state.bookings.filteredBookings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveBookings: (bookings) => {
      dispatch(saveBookings(bookings));
    },
    filterByCompleted: () => {
      dispatch(filterByCompleted());
    },
    filterByPending: () => {
      dispatch(filterByPending());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Booking);
