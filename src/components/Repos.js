import React from 'react';
import styled from 'styled-components';
import { useGithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

const Repos = () => {
  const { repos } = useGithubContext();
  console.log(repos);

  const languages = repos.reduce((total, repo) => {
    const { language, stargazers_count: stars } = repo;
    if (!language) return total;
    if (total[language]) {
      total[language].value = total[language].value + 1;
      total[language].stars = total[language].stars + stars;
    } else {
      total[language] = { label: language, value: 1, stars };
    }

    return total;
  }, {});

  const mostPopulatLngs = Object.values(languages)
    .sort((a, b) => b - a)
    .map((item) => ({ label: item.label, value: item.value }))
    .slice(0, 5);

  const starsPerLngs = Object.values(languages)
    .sort((a, b) => b - a)
    .map((item) => ({ label: item.label, value: item.stars }))
    .slice(0, 5);

  let { stars, forks } = repos.reduce(
    (total, language) => {
      const { stargazers_count, forks, name } = language;

      total.stars[stargazers_count] = {
        label: name,
        value: stargazers_count,
      };
      total.forks[forks] = { label: name, value: forks };

      return total;
    },
    { stars: {}, forks: {} }
  );

  stars = Object.values(stars)
    .slice(-5)
    .sort((a, b) => b.value - a.value);

  forks = Object.values(forks)
    .slice(-5)
    .sort((a, b) => b.value - a.value);

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D data={mostPopulatLngs} />
        <Column3D data={stars} />
        <Doughnut2D data={starsPerLngs} />
        <Bar3D data={forks} />
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
