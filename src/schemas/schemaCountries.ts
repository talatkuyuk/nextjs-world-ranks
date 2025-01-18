import { z } from "zod";

export const CountrySchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string(),
    nativeName: z
      .record(
        z.object({
          official: z.string(),
          common: z.string(),
        })
      )
      .optional(),
  }),
  tld: z.array(z.string()).optional(),
  cca2: z.string(),
  ccn3: z.string().optional(),
  cca3: z.string(),
  cioc: z.string().optional(),
  independent: z.boolean().optional(),
  status: z.string().optional(),
  unMember: z.boolean().optional(),
  currencies: z
    .record(
      z.object({
        name: z.string(),
        symbol: z.string().optional(),
      })
    )
    .nullable()
    .optional(),
  idd: z
    .object({
      root: z.string().optional(),
      suffixes: z.array(z.string()).optional(),
    })
    .optional(),
  capital: z.array(z.string()).nullable().optional(),
  altSpellings: z.array(z.string()).optional(),
  region: z.string(),
  subregion: z.string().nullable().optional(),
  languages: z.record(z.string()).nullable().optional(),
  translations: z
    .record(
      z.object({
        official: z.string(),
        common: z.string(),
      })
    )
    .optional(),
  latlng: z.array(z.number()),
  landlocked: z.boolean(),
  borders: z.array(z.string()).nullable().optional(),
  area: z.union([z.string(), z.number()]),
  demonyms: z
    .object({
      eng: z.object({
        f: z.string(),
        m: z.string(),
      }),
      fra: z
        .object({
          f: z.string(),
          m: z.string(),
        })
        .optional(),
    })
    .optional(),
  flag: z.string().optional(),
  maps: z
    .object({
      googleMaps: z.string().url(),
      openStreetMaps: z.string(),
    })
    .optional(),
  population: z.union([z.string(), z.number()]),
  gini: z.record(z.number()).nullable().optional(),
  fifa: z.string().optional(),
  car: z
    .object({
      signs: z.array(z.string()).optional(),
      side: z.string(),
    })
    .optional(),
  timezones: z.array(z.string()),
  continents: z.array(z.string()),
  flags: z
    .object({
      png: z.string().url(),
      svg: z.string().url(),
      alt: z.string().optional(),
    })
    .optional(),
  coatOfArms: z
    .object({
      png: z.string().url().optional(),
      svg: z.string().url().optional(),
    })
    .optional(),
  startOfWeek: z.string().optional(),
  capitalInfo: z
    .object({
      latlng: z.array(z.number()).optional(),
    })
    .optional(),
  postalCode: z
    .object({
      format: z.string(),
      regex: z.string().optional(),
    })
    .optional(),
});

export const CountriesSchema = z.array(CountrySchema);

export type Country = z.infer<typeof CountrySchema>;
export type Countries = z.infer<typeof CountriesSchema>;
