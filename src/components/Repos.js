import React from 'react';
import styled from 'styled-components';
import { useGithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

const Repos = () => {
  const { repos } = useGithubContext();
  console.log(repos);
  let data = repos.reduce((acc, cur) => {
    if (acc[cur.language]) {
      acc[cur.language] = acc[cur.language] + 1;
    } else {
      acc[cur.language] = 1;
    }
    return acc;
  }, {});

  let chartData = [];

  for (let [key, value] of Object.entries(data)) {
    if (key === 'null') continue;
    chartData.push({
      label: key,
      value,
    });
  }

  chartData = chartData.sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D data={chartData} />
        <div></div>
        <Doughnut2D data={chartData} />
        <div></div>
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
