import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../assets/URLS";
import ContentBox from "../components/StaffSection/ContentBox";
import ChartForBooking from "../components/Statics/ChartForBooking";
import ChartForRestaurent from "../components/Statics/ChartForRestaurent";
import ChartForTicket from "../components/Statics/ChartForTicket";
import Loading from "../components/Loading";
import FileDownload  from "js-file-download"

const months = [
  "JAN",
  "FEB",
  "MARCH",
  "APR",
  "MAY",
  "JUN",
  "JULY",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function Statics() {
  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [roomsStastics, setRoomStastics] = useState([]);
  const [ticketStastics, setTicketStastics] = useState([]);
  const [foodStastics, setFoodStastics] = useState([]);
  const [state, setState] = useState(0);

  const [startMonth, setStartMonth] = useState(1);
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMont] = useState(1);
  const [endYear, setEndYear] = useState("");

  // DOWNLOAD ROOM BOOKING LOG AS CSV
  const DownloadLogAsCsv = () => {
    setProcessLoading(true);
    
    let url, filename;
    if(state === 0){
      url = api.resort_csv;
      filename = `resortLog-${months[startMonth - 1]}${startYear}-${months[endMonth - 1]}${endYear}.csv`;
    } else if(state === 1){
      url = api.food_csv;
      filename = `foodLog-${months[startMonth - 1]}${startYear}-${months[endMonth - 1]}${endYear}.csv`;
    } else {
      url = api.ticket_csv;
      filename = `ticketLog-${months[startMonth - 1]}${startYear}-${months[endMonth - 1]}${endYear}.csv`;
    }
    const REFRESH_TOKEN = localStorage.getItem("refresh_token");
    const GET_ACCESS_TOKEN_URL = api.refresh;
    const GET_CSV = `${url}?month_start=${startMonth}&year_start=${startYear}&month_end=${endMonth}&year_end=${endYear}`

    axios
    .post(GET_ACCESS_TOKEN_URL, { refresh: REFRESH_TOKEN })
    .then((token) => { const Config = { headers: { Authorization: "Bearer " + token.data.access }};

      axios
      .get(GET_CSV, Config)
      .then((res) => {
        setProcessLoading(false);
        FileDownload(res.data, filename);
      })
      .catch((err) => { console.log(err.message); setProcessLoading(false); });    
    })
    .catch((err) => {setProcessLoading(false); console.log(err.message); })
  };

  
  useEffect(() => {
    setLoading(true);
    const REFRESH_TOKEN = localStorage.getItem("refresh_token");
    const GET_ACCESS_TOKEN_URL = api.refresh;
    const ROOM_STATESTICS = api.resort_stastics;
    const TICKET_STATESTICS = api.ticket_stastics;
    const FOOD_STATESTICS = api.food_stastics;

    axios
      .post(GET_ACCESS_TOKEN_URL, { refresh: REFRESH_TOKEN })
      .then((token) => {
        const Config = { headers: { Authorization: "Bearer " + token.data.access }};

        // room - data
        axios
        .get(ROOM_STATESTICS, Config)
        .then((res) => { setRoomStastics(res.data);})
        .catch((err) => { console.log(err.message); });

        // food - data
        axios.get(FOOD_STATESTICS, Config)
        .then((res) => {setFoodStastics(res.data);})
        .catch((err) => {console.log(err.message)});

        // ticket - data
        axios
        .get(TICKET_STATESTICS, Config)
        .then((res) => { setTicketStastics(res.data); setLoading(false); })
        .catch((err) => { console.log(err.message); setLoading(false); });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  }, []);

  return (
    <ContentBox heading="Stastics">
      <div className="statics">
        <div className="graph">
          {!loading ? (
            state === 0 ? (
              <ChartForBooking datas={roomsStastics} />
            ) : state === 1 ? (
              <ChartForRestaurent datas={foodStastics} />
            ) : (
              <ChartForTicket datas={ticketStastics} />
            )
          ) : (
            <Loading
              width="100%"
              height="calc(90vh - 10px)"
              text="fetching data"
              textSize="16px"
            />
          )}
        </div>
        <div className="info">
          <div className="button-container">
            <button className="rooms" onClick={() => setState(0)}>
              Room
            </button>
            <button className="foods" onClick={() => setState(1)}>
              Food
            </button>
            <button className="tickets" onClick={() => setState(2)}>
              Ticket
            </button>
          </div>

          <h3>DOWNLOAD CSV</h3>
          <p>
            To get the statistics of the resort within a certain period of time
            please set the time limit and clcik the download button
          </p>

          <form className="csv">
            <h3>From</h3>
            <div className="input-container">
              <div className="input w-50">
                <div className="select">
                  <select
                    name="role"
                    id="role"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                  >
                    {months.map((month, index) => (
                      <option value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input w-50">
                <input
                  type="email"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  placeholder="Year"
                />
              </div>
            </div>

            <h3>To</h3>
            <div className="input-container">
              <div className="input w-50">
                <div className="select">
                  <select
                    name="role"
                    id="role"
                    value={endMonth}
                    onChange={(e) => setEndMont(e.target.value)}
                  >
                    {months.map((month, index) => (
                      <option value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input w-50">
                <input
                  type="email"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  placeholder="Year"
                />
              </div>
            </div>
          </form>
          {
            !processLoading
            ?  state === 0
              ? <button className="blue-btn" onClick={DownloadLogAsCsv}> Download CSV </button>
              : state === 1
                ? <button className="green-btn" onClick={DownloadLogAsCsv}> Download CSV </button>
                : <button className="yellow-btn" onClick={DownloadLogAsCsv}> Download CSV </button>
            : <button>Downloading...</button>
          }
        </div>
      </div>
    </ContentBox>
  );
}

export default Statics;
