import { useState } from "react";
import CountriesTable from "@/components/CountriesTable/CountriesTable";
import Layout from "@/components/Layout/Layout";
import SearchInput from "@/components/SearchInput/SearchInput";
import styles from "@/styles/Home.module.css";
import { CountriesSchema, type Countries } from "@/schemas/schemaCountries";

export default function Home({ countries }: { countries: Countries }) {
  const [keyword, setKeyword] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.common.toLowerCase().includes(keyword) ||
      country.name.official.toLowerCase().includes(keyword) ||
      country.region.toLowerCase().includes(keyword) ||
      country.subregion?.toLowerCase().includes(keyword)
  );

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();

    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <Layout>
      <div className={styles.inputContainer}>
        <div className={styles.counts}>Found {countries.length} countries</div>

        <div className={styles.input}>
          <SearchInput
            placeholder="Filter by Name, Region or SubRegion"
            onChange={onChange}
          />
        </div>
      </div>

      <CountriesTable countries={filteredCountries} />
    </Layout>
  );
}

export const getStaticProps = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");

  if (!res.ok) {
    throw new Error(`Failed to fetch countries: ${res.statusText}`);
  }

  const rawData = await res.json();
  const result = CountriesSchema.safeParse(rawData);

  if (!result.success) {
    console.error("Validation errors:", result.error.errors);
    throw new Error("Failed to validate countries data.");
  }

  const countries = result.data.map(
    ({
      name,
      region,
      subregion,
      cca3,
      population,
      area,
      gini,
      flag,
      flags,
    }) => ({
      name,
      region,
      subregion: subregion ?? null,
      cca3,
      population: population.toLocaleString(),
      area: area.toLocaleString(),
      gini: gini ?? null,
      flag,
      flags,
    })
  ); // Only pass minimal data of countries

  return {
    props: {
      countries,
    },
  };
};
