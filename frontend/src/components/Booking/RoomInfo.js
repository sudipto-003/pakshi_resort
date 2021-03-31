import React, { useState } from "react";
import search from "../../assets/images/View/svg/search.svg";
import { hexagon, rsvg } from "../../assets/images/SVG";

import BookingForm from "./BookingForm";

function RoomInfo({ availableRooms, availableRoomsByGroup, searched, bookCardOn, setBookCardOn }) {
  const [roomData, setRoomData] = useState("");

  const openBookingForm = (no) => {
    setBookCardOn(true);
    setRoomData(no);
  };

  return (
    <div className="roomInfo">
      {!searched ? (
        <div className="beforeSearch">
          <div>
            <img src={search} alt="" />
            <h2>Fill Checkin & Checkout date to view available rooms</h2>
          </div>
        </div>
      ) : !bookCardOn ? (
        <div className="afterSerch">
          <div className="availavleRoomTable">
            <div className="table-heading">
              <div className="id">Id {rsvg}</div>
              <div className="no">Room Numb {rsvg}</div>
              <div className="type">Room Type{rsvg}</div>
            </div>
            {availableRooms.map((room) => (
              <div
                className="available-room"
                onClick={() => {
                  openBookingForm(room.room_num);
                }}
              >
                <div className="id">{room.id}</div>
                <div className="no"># {room.room_num}</div>
                <div className="type">{room.room_type}</div>
              </div>
            ))}
          </div>
          <div className="availableRoomGroup">
            <div className="head">Total available rooms</div>
            {
              availableRoomsByGroup.map(room => (
                <div className="data">
                  {/* <div className="logo">{hexagon}</div> */}
                  <div className="type">{room.type}</div>
                  <div className="value"><h3>{room.available}</h3></div>
                </div>
              ))
            }
            <div className="data">
                  {/* <div className="logo">{hexagon}</div> */}
                  <div className="type">Extra entry</div>
                  <div className="value"><h3>0</h3></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="beforeSearch">
          <BookingForm roomNo={roomData} />
        </div>
      )}
    </div>
  );
}

export default RoomInfo;
