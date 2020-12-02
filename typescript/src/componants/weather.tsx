import React from "react";
import { useState, useEffect } from "react";

//import data from "../Repository/city.list.json";
import { City } from "../interfaces/City";
import { Col, Row, Layout, Select, Tag, Result } from "antd";
import Title from "antd/lib/typography/Title";
import * as _ from "lodash";
import styled from "styled-components";
import useLocalStorage from "react-use-localstorage";
import { CityWeather } from "../interfaces/CityWeather";
import { WeatherTable } from "./weatherTable";
import { Console } from "console";

const { Option } = Select;
const { Content } = Layout;

const CustomLayout = styled(Layout)`
  height: 100% !important;
`;

//import styled from 'styled-components';

var allCities = new Array<City>();

export const Weather = () => {
  const [cities, setCities] = useState(new Array<City>());

  const [myCities, setMyCities] = useState(new Array<number>()); // To update to localstorage
  const [citiesWeather, setCitiesWeather] = useLocalStorage(
    "citiesWeather",
    JSON.stringify([])
  );

  const [error, setError] = useState("");
  const ApiKey = "219d801f59d66e8ffe10f034f3e71979";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/group?id=${myCities.toString()}&appid=${ApiKey}`
          // Test Error
          //`https://oops`
        );

        if (response.ok) {
          var data = await response.json();

          setCitiesWeather(JSON.stringify(data.list));
        } else {
          setError("Error Occured");
        }
      } catch (error) {
        setError(error.message);
      }

      // })
      // .then((res: any) => {
      //   debugger;
      //   setCitiesWeather(JSON.stringify(res.list));
      // })
      // .catch(function (error) {
      //   debugger;
      //   setError(error);
      // });
    };

    if (myCities.length > 0) fetchData();
  }, [myCities, setCitiesWeather]);

  useEffect(() => {
    fetch("city.list.json")
      .then((response) => response.json())
      .then((body: Array<City>) => {
        allCities = body;
      });
  }, []);

  const debouncedFetchCity = (value: string) => {
    // TODO - Clean Data for Cities that have the same City and Country
    setCities(
      allCities
        // Find where Starts with
        .filter(
          (x) =>
            x.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) === 0
        )
        // Fetch first 10
        .slice(0, 10)
    );
  };

  const fetchCity = _.debounce(debouncedFetchCity, 200);

  const handleChange = (value: Array<number>) => {
    setMyCities(value);
  };

  return (
    <>
      <CustomLayout>
        <Content>
          <Row>
            <Col></Col>
          </Row>
          <Row>
            <Col span={24} offset={1} style={{ paddingTop: "12px" }}>
              <Title level={2}>My Weather</Title>
            </Col>
          </Row>
          <Row>
            <Col span={22} offset={1} style={{ paddingBottom: "12px" }}>
              <Select
                disabled={myCities.length > 19}
                filterOption={false}
                mode="multiple"
                value={myCities}
                allowClear
                tagRender={(props) => {
                  const { value, onClose } = props;
                  var city = allCities.find((x) => x.id === value);

                  return (
                    <Tag closable={true} onClose={onClose}>
                      {city?.name} ({city?.country})
                    </Tag>
                  );
                }}
                style={{ width: "100%" }}
                placeholder="Search for your City"
                onChange={handleChange}
                onSearch={fetchCity}
              >
                {cities.map((city) => {
                  return (
                    <Option key={city.id} value={city.id}>
                      {city.name} ({city.country})
                    </Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={22} offset={1} style={{ paddingBottom: "32px" }}>
              {myCities.length > 0 &&
                error === "" &&
                console.log(citiesWeather) &&
                citiesWeather &&
                citiesWeather.length > 1 && (
                  <WeatherTable citiesWeather={JSON.parse(citiesWeather)} />
                )}
              {error !== "" && (
                <Result
                  title={error}
                  subTitle="Please try again in a few minutes"
                />
              )}
            </Col>
          </Row>
        </Content>
      </CustomLayout>
    </>
  );
};
