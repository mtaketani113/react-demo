import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Container } from "semantic-ui-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = () => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "2022年体重",
      },
    },
  };

  const labels = [
    "2022/10/27",
    "2022/10/28",
  ];

  const graphData = {
    labels,
    datasets: [
      {
        label: "体重",
        data: [70.1, 70.0],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Container text style={{ marginTop: '7em' }}>
      <Line
        height={300}
        width={300}
        data={graphData}
        options={options}
        id="chart-key"
      />
    </Container>
  );
};
export default Graph;
