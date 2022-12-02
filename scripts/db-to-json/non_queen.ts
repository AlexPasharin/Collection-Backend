import { writeFileSync } from "fs";
import {
  find,
  groupBy,
  map,
  mapObjIndexed,
  omit,
  pipe,
  prop,
  sortBy,
  values,
} from "ramda";

import { dbConnection } from "../../src/db";

const connection = new dbConnection();

type Release = {
  id: number;
  artist_name: string;
  index_by?: string | null;
  name: string;
  discogs_url?: string | null;
  format: string;
  comment?: string | null;
};

connection
  .getNonQueenCollection()()
  .then((releasesFlatArray: Release[]) => {
    connection.close();

    const releasesByArtist = pipe(
      groupBy<Release>(prop<string>("artist_name")),
      mapObjIndexed((releases, artistName) => ({
        artist: artistName,
        index_by: find((r) => !!r.index_by, releases)?.index_by || artistName,
        releases: pipe(
          map(({ id, name, discogs_url, format, comment }) => ({
            id,
            name,
            format,
            discogs_url: discogs_url || undefined,
            comment: comment || undefined,
          })),
          sortBy(prop("name"))
        )(releases),
      })),
      values,
      sortBy(prop("index_by")),
      map((artistData) => omit(["index_by"], artistData))
    )(releasesFlatArray);

    writeFileSync(
      "./data/non_queen_collection.json",
      JSON.stringify(releasesByArtist)
    );

    writeFileSync(
      "./data/debug/non_queen_collection.json",
      JSON.stringify(releasesByArtist, null, 2)
    );
  });
