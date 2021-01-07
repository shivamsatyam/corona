import React,{useState,useEffect} from 'react'
import './App.css'
import numeral from "numeral";
import { sortData, prettyPrintStat } from "./util";
import InfoBox from './infoBox'
import Table from "./Table"
import LineGraph from "./LineGraph";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import Map from './Map'
import "leaflet/dist/leaflet.css";


function App () {

  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

	{/*for fetching the total cases all over the world*/}
	useEffect(()=>{
	 fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        console.log("first",data)
      });
	},[])



	{/*for fetching all the countries datas from the api*/}


	useEffect(()=>{
		const getCountriesData = async()=>{
			fetch("https://disease.sh/v3/covid-19/countries")
			.then((response)=>response.json())
			.then((data)=>{
			{/*the data object is in an aray form for converting it into dictionary*/}

			const countries = data.map((country)=>({
				name:country.country,
				value:country.countryInfo.iso2
			}))
			console.log('the countries is ',countries)
			console.log('the data is ',data)

			let sortedData =sortData(data)
			 setCountries(countries);
          	setMapCountries(data);
          	setTableData(sortedData);


		})
		}

		getCountriesData()
	},[])


  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

	return(
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 Tracker</h1>

					<FormControl>
						<Select varient="outlined" value={country} onChange={onCountryChange}>
							<MenuItem value="worldwide">WorldWide</MenuItem>
							{
								countries.map((country)=>{
									return <MenuItem value={country.value}>{country.name}</MenuItem>
								})
								}
						</Select>
					</FormControl>
				</div>


				<div className="app__stats">
					 <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
				</div>
   <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />

			</div>

      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
             <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
		</div>
		)	
}


export default App






































