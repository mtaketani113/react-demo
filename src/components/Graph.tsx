import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Container } from 'semantic-ui-react';
import { GraphEntity } from './entity/GraphEntity';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = () => {

  const [data2, setData] = useState<Array<GraphEntity>>([]);

  const loadGraph = () => {
    axios.get("http://localhost:3000/weight.json").then((res) => {
      setData(res.data);
    });
  }

  useEffect(() => {
    loadGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '2022年体重',
      },
    },
  };

  const labels = data2.map(data => data.date);

  const graphData = {
    labels,
    datasets: [
      {
        label: '体重',
        data: data2.map(data => data.weight),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <Container text style={{ marginTop: '7em' }}>
      <Line height={300} width={300} data={graphData} options={options} id="chart-key" />
    </Container>
  );
};
export default Graph;
