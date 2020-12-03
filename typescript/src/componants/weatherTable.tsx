import { Table } from "antd";
import React from "react";
import { CityWeather } from "../interfaces/CityWeather";

export const WeatherTable = ({
  citiesWeather,
}: {
  citiesWeather: Array<CityWeather>;
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: CityWeather, b: CityWeather) => a.name.length - b.name.length,
    },
    {
      title: "Feels Like",
      dataIndex: ["main", "feels_like"],
      key: "feels_like",
      sorter: (a: CityWeather, b: CityWeather) =>
        a.main.feels_like - b.main.feels_like,
    },
    {
      title: "Humidity",
      dataIndex: ["main", "humidity"],
      key: "humidity",
      sorter: (a: CityWeather, b: CityWeather) =>
        a.main.feels_like - b.main.feels_like,
    },
    {
      title: "Pressure",
      dataIndex: ["main", "pressure"],
      key: "pressure",
      sorter: (a: CityWeather, b: CityWeather) =>
        a.main.pressure - b.main.pressure,
    },
    {
      title: "Now",
      dataIndex: ["main", "temp"],
      key: "temp",
      sorter: (a: CityWeather, b: CityWeather) => a.main.temp - b.main.temp,
    },
    {
      title: "Todays High",
      dataIndex: ["main", "temp_max"],
      key: "temp_max",
      sorter: (a: CityWeather, b: CityWeather) =>
        a.main.temp_max - b.main.temp_max,
    },
    {
      title: "Todays Min",
      dataIndex: ["main", "temp_min"],
      key: "temp_min",
      sorter: (a: CityWeather, b: CityWeather) =>
        a.main.temp_min - b.main.temp_min,
    },
  ];

  return (
    <Table
      dataSource={citiesWeather}
      columns={columns}
      rowKey={(record) => record.id}
      pagination={{ pageSize: 20 }}
    />
  );
};
