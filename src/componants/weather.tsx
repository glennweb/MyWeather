import React from "react";
import { useState, useEffect } from "react";

//import data from "../Repository/city.list.json";
import { City } from "../interfaces/City";
import { Col, Row, Layout, Select, Tag, Result, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import * as _ from "lodash";
import styled from "styled-components";
import useLocalStorage from "react-use-localstorage";
import { CityWeather } from "../interfaces/CityWeather";
import { WeatherTable } from "./weatherTable";

const { Option } = Select;
const { Content } = Layout;

const CustomLayout = styled(Layout)`
  height: 100% !important;
`;

export const Weather = () => {
  const [allCities, setAllCities] = useState(new Array<City>());
  const [cities, setCities] = useState(new Array<City>());
  const [myCities, setMyCities] = useLocalStorage(
    "myCities",
    JSON.stringify(new Array<number>())
  );
  const [citiesWeather, setCitiesWeather] = useState(new Array<CityWeather>());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ApiKey = "219d801f59d66e8ffe10f034f3e71979";

  useEffect(() => {
    const _myCities: Array<Number> = JSON.parse(myCities);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/group?id=${_myCities.toString()}&appid=${ApiKey}`
        );

        if (response.ok) {
          var data = await response.json();
          setCitiesWeather(data.list);
          setError("");
        } else {
          setError("Error Occured");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (_myCities.length > 0) {
      fetchData();
    } else {
      setCitiesWeather([]);
    }
  }, [myCities, setCitiesWeather]);

  useEffect(() => {
    const getAllCities = async () => {
      setLoading(true);
      const response = await fetch("city.list.json");
      if (response.ok) {
        var data = await response.json();
        setAllCities(data);
        setError("");
      } else {
        setError("Error Occured Loading Cities List");
      }
      setLoading(false);
    };
    getAllCities();
  }, [setAllCities]);

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
        .slice(0, 30)
    );
  };

  const fetchCity = _.debounce(debouncedFetchCity, 200);

  const handleChange = (value: Array<number>) => {
    setMyCities(JSON.stringify(value));
  };

  return (
    <Spin spinning={loading}>
      <CustomLayout>
        <Content>
          <Row>
            <Col></Col>
          </Row>
          <Row>
            <Col span={22} offset={1} style={{ paddingTop: "12px" }}>
              <Title level={2}>My Weather</Title>
            </Col>
          </Row>
          <Row>
            <Col span={22} offset={1} style={{ paddingBottom: "12px" }}>
              <Select
                disabled={citiesWeather.length >= 20}
                filterOption={false}
                mode="multiple"
                value={JSON.parse(myCities)}
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
              {citiesWeather?.length > 0 && error === "" && (
                <WeatherTable citiesWeather={citiesWeather} />
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
    </Spin>
  );
};
