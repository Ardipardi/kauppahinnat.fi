import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getData from "../../setUp/dataSetUp";
import Grid from "./Grid";
import InfoView from "./InfoView";
import TableByCity from "./TableByCity";
import TableByCitySide from "./TableByCitySide";

export default function Home({ transactionsByCity }) {
  const [summaryData, setsummaryData] = useState([]);
  const [summaryDataByCity, setsummaryDataByCity] = useState([]);
  const [regionInfoActive, setRegionInfoActive] = useState("Suomi");
  const [regionActiveCityList, setRegionActiveCityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(false);
  const [cityTableInfo, setCityTableInfo] = useState("");

  const onClickHandler = (e) => {
    console.log(e);
    console.log("onClickHandler");
    setRegionInfoActive(e.target.id);
    if (e.target.id === "Suomi") {
      setCityTableInfo("");
    }
  };
  const onClickHandlerCityTable = (e) => {
    console.log(e);
    console.log("onClickHandlerCityTable");
    setCityTableInfo(e.indexValue);
  };

  const onClickHandlerCityTableSide = (e) => {
    console.log(e);
    console.log("onClickHandlerCityTableSide");
  };

  useEffect(() => {
    setCityTableInfo("");
  }, [regionInfoActive]);

  useEffect(() => {
    const fetchData = async () => {
      let res_summaryByAreaCountry = await getData("summaryByArea", {
        type: "country",
      });

      setsummaryData(res_summaryByAreaCountry);
      setLoading(false);
      setInitLoad(true);
    };
    setLoading(true);

    fetchData();
  }, []);

  useEffect(() => {
    if (initLoad === false) return null;
    if (initLoad === "complete") return null;
    const fetchData = async () => {
      let res_summaryByAreaRegion = await getData("summaryByArea", {
        type: "region",
      });

      setsummaryData([...summaryData, ...res_summaryByAreaRegion]);

      /* let res_summaryByAreaCity = await getData("summaryByArea", {
        type: "city",
      });

      setsummaryDataByCity(res_summaryByAreaCity);
      console.log(res_summaryByAreaCity);
      console.log("res_summaryByAreaCity"); */

      setInitLoad("complete");
      setLoading(false);
    };
    setLoading(true);
    fetchData();
  }, [initLoad]);

  useEffect(() => {
    if (initLoad !== "complete") return null;
    console.log("regionMuuttu");

    const fetchData = async () => {
      let res_summaryByAreaCity = await getData("summaryByArea", {
        type: "city",
      });
      let cities = [];
      try {
        let citiesByRegionRes = await getData("citiesByRegion");

        cities = citiesByRegionRes.filter(
          (e) => e.place === regionInfoActive
        )[0].data;
      } catch (error) {}

      console.log(cities);
      let data = [];
      for (const city in cities) {
        try {
          console.log(cities[city]);
          data.push(
            res_summaryByAreaCity.filter((e) => e.place === cities[city])[0]
          );
        } catch (error) {}
      }
      console.log(data);
      console.log("data____________--");
      setRegionActiveCityList(data);
      console.log("DATA_HAETTU_ASYNC");
    };

    fetchData();
    console.log("DATA_HAETTU.OUTSIDE");
  }, [regionInfoActive]);

  return (
    <div>
      <h1 style={{ paddingTop: "50px" }}>Kauppahinnat.fi</h1>
      <h3 style={{ paddingBottom: "50px" }}>Dataa asuntojen hinnoista</h3>

      <div className="flex-container">
        <div style={{ width: "50%" }}>
          <h5
            style={
              {
                /* width: "50%" */
              }
            }
          >
            Tilastoja maakunnittain
          </h5>

          {loading === false ? (
            <div>
              <Grid data={summaryData} width="100%" onClick={onClickHandler} />

              {initLoad !== "complete" ? (
                <div style={{ paddingTop: "100px", fontSize: "2em" }}>
                  Hetki, ladataan lisää tietoa..
                </div>
              ) : null}
            </div>
          ) : (
            <div
              style={{
                height: "400px",
                alignContent: "center",
                verticalAlign: "center",
              }}
            >
              {" "}
              ladataan...{" "}
            </div>
          )}
        </div>

        <div style={{ width: "50%" }}>
          <h5
            style={
              {
                /* width: "50%"  */
              }
            }
          >
            {regionInfoActive}
          </h5>
          {loading === false ? (
            <InfoView data={summaryData} area={regionInfoActive} width="100%" />
          ) : (
            <div
              style={{
                height: "400px",
                alignContent: "center",
                verticalAlign: "center",
              }}
            >
              {" "}
              ladataan...{" "}
            </div>
          )}
        </div>
      </div>

      <div
        className="flex-container"
        style={{ /* height: "300px", */ margin: "30px" }}
      >
        <div style={{ maxHeight: "500", width: "80%" }}>
          <h6>
            {" "}
            {regionInfoActive === "Suomi" ? "" : regionInfoActive + " -"} Kaupat
            kaupungeittain
          </h6>

          <TableByCity
            area={regionInfoActive}
            data={regionActiveCityList}
            summaryData={summaryData}
            onClickHandler={onClickHandlerCityTable}
          />
        </div>

        <div
          style={{
            maxHeight: "280px",
            /* overflowY: "scroll", */ paddingTop: "50px",
            width: "20%",
          }}
        >
          {cityTableInfo !== "" ? (
            <div
              style={{
                /* overflowY: "scroll", */ paddingTop: "30px",
              }}
            >
              <h5>{cityTableInfo}</h5>
              {
                <TableByCitySide
                  area={cityTableInfo}
                  data={regionActiveCityList}
                  summaryData={summaryData}
                  onClickHandler={onClickHandlerCityTableSide}
                />
              }

              <Link to={`/kaupunki/${cityTableInfo}`}>
                Siirry katsomaan kaupungin tietoja
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
