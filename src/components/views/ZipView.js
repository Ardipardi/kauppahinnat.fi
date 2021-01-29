import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Grid from "../home/Grid";
import 'bootstrap/dist/css/bootstrap.min.css';
import getData from "./../../setUp/dataSetUp";
import Table from "./Table";

export default function ZipView(props) {
  let { zip } = useParams();
  let Sales = findZipData(props.zipData, zip).data;

  const [summaryByRooms, setsummaryByRooms] = useState([]);
  const [apartmentInfoActive, setApartmentInfoActive] = useState("Kaikki");

  const onClickHandler = (e) => {
    setApartmentInfoActive(e.target.id);
  };

  useEffect(() => {      
    getData("summaryByRooms", { sales: Sales }).then((summaries) => {
        setsummaryByRooms(summaries);
    })

  }, []);

  // Haetaan listalta oikean postinumeron tiedot
  function findZipData(array, value) {    
    return array.find((element) => {
        return element.place === value;
        })
    }

  return (
    <div>
      <h1 style={{ padding: "50px" }}>Postinumero: {zip}</h1>
      <div className="flex-container">
        <div style={{ width: "100%" }}>
            <Grid
                data={summaryByRooms}
                width="100%"
                onClick={onClickHandler}
            />
            <div
              style={{
                height: "50px",
                alignContent: "center",
                verticalAlign: "center",
              }}
            >
            </div>

            <div style={{ width: "100%" }}>
                <h5>{apartmentInfoActive}</h5>
                <Table sales={Sales} room={apartmentInfoActive} />
            </div>
            <div
              style={{
                height: "100px",
                alignContent: "center",
                verticalAlign: "center",
              }}
            >
            </div>
        </div>
      </div>      
    </div>
  );
}