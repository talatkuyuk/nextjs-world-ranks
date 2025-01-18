import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import styles from "./Country.module.css";
import { CountriesSchema, type Country } from "@/schemas/schemaCountries";
import Image from "next/image";

const getCountry = async (id: string): Promise<Partial<Country>> => {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);

    if (!res.ok) {
      console.error(`Failed to fetch country: ${res.statusText}`);
      throw new Error(`Failed to fetch country: ${res.statusText}`);
    }

    const rawData = await res.json();
    const result = CountriesSchema.safeParse(rawData);

    if (!result.success) {
      console.error("Validation errors:", result.error.errors);
      throw new Error("Invalid country data received from API.");
    }

    const {
      name,
      cca3,
      population,
      area,
      gini,
      flags,
      currencies,
      languages,
      borders,
      capital,
    } = result.data[0]; // Only pass minimal data of countries

    return {
      name,
      cca3,
      population: population.toLocaleString(),
      area: area.toLocaleString(),
      gini: gini ?? null,
      flags,
      currencies: currencies ?? null,
      languages: languages ?? null,
      borders: borders ?? null,
      capital: capital ?? null,
    };
  } catch (error) {
    console.error("Error in getCountry:", error);
    throw error;
  }
};

const CountryPage = ({ country }: { country: Country | null }) => {
  const [borders, setBorders] = useState<Partial<Country>[]>([]);

  useEffect(() => {
    const getBorderCountries = async () => {
      if (!country) return;

      try {
        const borderCountries = await Promise.all(
          (country.borders ?? []).map((border) => getCountry(border))
        );
        setBorders(borderCountries);
      } catch (error) {
        console.error("Error fetching border countries:", error);
      }
    };

    getBorderCountries();
  }, [country]);

  if (!country) {
    return <div>Country data is unavailable.</div>;
  }

  return (
    <Layout title={country.name.common}>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <div className={styles.overview_panel}>
            <Image
              title={country.name.common}
              alt={country.flags?.alt ?? `Flag of ${country.name.common}`}
              src={country.flags?.png ?? ""}
              fill
            />

            <h1 className={styles.overview_name}>{country.name.common}</h1>
            <div className={styles.overview_region}>{country.region}</div>

            <div className={styles.overview_numbers}>
              <div className={styles.overview_population}>
                <div className={styles.overview_value}>
                  {country.population}
                </div>
                <div className={styles.overview_label}>Population</div>
              </div>

              <div className={styles.overview_area}>
                <div className={styles.overview_value}>{country.area}</div>
                <div className={styles.overview_label}>Area</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container_right}>
          <div className={styles.details_panel}>
            <h4 className={styles.details_panel_heading}>Details</h4>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Capital</div>
              <div className={styles.details_panel_value}>
                {country.capital}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Languages</div>
              <div className={styles.details_panel_value}>
                {country.languages
                  ? Object.values(country.languages).join(", ")
                  : "No languages available"}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Currencies</div>
              <div className={styles.details_panel_value}>
                {country.currencies
                  ? Object.values(country.currencies)
                      .map((currency) => currency.name)
                      .join(", ")
                  : "No currencies available"}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Native name</div>
              <div className={styles.details_panel_value}>
                {typeof country.name.nativeName !== "undefined"
                  ? Object.values(country.name.nativeName)[0]?.common ?? "N/A"
                  : "N/A"}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Gini</div>
              <div className={styles.details_panel_value}>
                {country.gini
                  ? Object.entries(country.gini).map(([key, value]) => (
                      <div key={key}>
                        {value} % ({key})
                      </div>
                    ))
                  : "N/A"}
              </div>
            </div>

            <div className={styles.details_panel_borders}>
              <div className={styles.details_panel_borders_label}>
                Neighbouring Countries
              </div>

              <div className={styles.details_panel_borders_container}>
                {borders.map(({ flags, name }) => (
                  <div
                    className={styles.details_panel_borders_country}
                    key={name?.official}
                  >
                    <Image
                      title={name?.common}
                      alt={flags?.alt ?? `Flag of ${name?.common}`}
                      src={flags?.png ?? ""}
                      fill
                    />

                    <div className={styles.details_panel_borders_name}>
                      {name?.common}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CountryPage;

export const getStaticPaths = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();

  // Validate the countries array
  const countriesValidationResult = CountriesSchema.safeParse(countries);

  if (!countriesValidationResult.success) {
    console.error("Validation failed:", countriesValidationResult.error);
    return { paths: [], fallback: false }; // Handle validation failure (you can adjust this behavior)
  }

  const paths = countriesValidationResult.data.map((country: Country) => ({
    params: { id: country.cca3 }, // Assuming cca3 is used as the country ID
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const country = await getCountry(params.id);

  return {
    props: {
      country,
    },
  };
};
