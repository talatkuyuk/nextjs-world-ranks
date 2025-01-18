import Link from "next/link";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useState } from "react";
import styles from "./CountriesTable.module.css";
import { type Country } from "@/schemas/schemaCountries";

type Direction = "asc" | "desc" | null;
type Field = "name" | "population" | "area" | "gini" | null;

const orderBy = <T extends object>(
  items: T[],
  field: keyof T,
  direction: Direction
): T[] => {
  if (!field) return items;

  return [...items].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    return 0;
  });
};

const SortArrow = ({ direction }: { direction: Direction }) => {
  if (!direction) {
    return <></>;
  }

  if (direction === "desc") {
    return (
      <div className={styles.heading_arrow}>
        <FaArrowDown color="inherit" />
      </div>
    );
  } else {
    return (
      <div className={styles.heading_arrow}>
        <FaArrowUp color="inherit" />
      </div>
    );
  }
};

const CountriesTable = ({ countries }: { countries: Country[] }) => {
  const [direction, setDirection] = useState<Direction>(null);
  const [field, setField] = useState<Field>(null);

  const orderedCountries = orderBy(
    countries,
    field as keyof Country,
    direction
  );

  const switchDirection = () => {
    if (!direction) {
      setDirection("desc");
    } else if (direction === "desc") {
      setDirection("asc");
    } else {
      setDirection(null);
    }
  };

  const setFieldAndDirection = (field: Field) => {
    switchDirection();
    setField(field);
  };

  return (
    <div>
      <div className={styles.heading}>
        <div className={styles.heading_flag}></div>

        <button
          className={styles.heading_name}
          onClick={() => setFieldAndDirection("name")}
        >
          <div>Name</div>

          {field === "name" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_population}
          onClick={() => setFieldAndDirection("population")}
        >
          <div>Population</div>

          {field === "population" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_area}
          onClick={() => setFieldAndDirection("area")}
        >
          <div>
            Area (km<sup style={{ fontSize: "0.5rem" }}>2</sup>)
          </div>

          {field === "area" && <SortArrow direction={direction} />}
        </button>

        <button
          className={styles.heading_gini}
          onClick={() => setFieldAndDirection("gini")}
        >
          <div>Gini</div>

          {field === "gini" && <SortArrow direction={direction} />}
        </button>
      </div>

      {orderedCountries.map((country) => (
        <Link href={`/country/${country.cca3}`} key={country.name.official}>
          <div className={styles.row}>
            <div className={styles.flag}>
              <span title={country.name.common}>{country.flag ?? "N/A"}</span>
            </div>
            <div className={styles.name}>{country.name.common}</div>

            <div className={styles.population}>{country.population}</div>

            <div className={styles.area}>{country.area}</div>

            <div className={styles.gini}>
              {country.gini
                ? Object.entries(country.gini).map(([key, value]) => (
                    <div key={key}>
                      {value} % ({key})
                    </div>
                  ))
                : "N/A"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CountriesTable;
