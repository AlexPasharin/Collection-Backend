import { Express } from "express";
import * as cors from "cors";

import { dbConnection, dbQueryFunc } from "../db";
import { readFile, readFileSync } from "fs";

const successHandler = (res) => (data) =>
  res.set("Access-Control-Allow-Origin", "*").json(data);

const errorHandler = (res, message: string) => (err) => {
  console.log(err.stack);
  res.set("Access-Control-Allow-Origin", "*").status(500).send(message);
};

const handler = (promiseFunc: dbQueryFunc, res, errorMsn: string) => {
  promiseFunc().then(successHandler(res)).catch(errorHandler(res, errorMsn));
};

export const setUpRestEndPoints = (
  app: Express,
  dBConnection: dbConnection
) => {
  const useJsons = process.env.USE_JSONS !== "false";

  app.get("/rest/artists", (_, res) =>
    handler(
      dBConnection.getArtists(),
      res,
      "Could not retrieve artists from the database"
    )
  );

  app.get("/rest/types", (req, res) => {
    const { artist } = req.query;

    handler(
      dBConnection.getArtistTypes(Number(artist)),
      res,
      `Could not retrieve entry types of artist\'s with id ${artist} from the database`
    );
  });

  app.get("/rest/entries", (req, res) => {
    const { artist, type } = req.query;

    handler(
      dBConnection.getEntriesByArtistAndType(Number(artist), Number(type)),
      res,
      `Could not retrieve artist\'s ${artist} entries of type ${type} from the database`
    );
  });

  app.get("/rest/entry", (req, res) => {
    const { id } = req.query;

    handler(
      dBConnection.getEntry(id),
      res,
      `Could not retrieve entry ${id} from the database`
    );
  });

  app.get("/rest/releases", (req, res) => {
    const { entry } = req.query;

    handler(
      dBConnection.getReleases(Number(entry)),
      res,
      `Could not retrieve releases of an entry ${entry} from the database`
    );
  });

  app.get("/rest/release", (req, res) => {
    const { id } = req.query;

    handler(
      dBConnection.getRelease(Number(id)),
      res,
      `Could not retrieve release with id ${id} from the database`
    );
  });

  app.get("/rest/labels", (_, res) => {
    handler(
      dBConnection.getLabels(),
      res,
      `Could not retrieve labels from the database`
    );
  });

  app.get("/rest/formats", (_, res) => {
    handler(
      dBConnection.getFormats(),
      res,
      `Could not retrieve formats from the database`
    );
  });

  app.get("/rest/countries", (_, res) => {
    handler(
      dBConnection.getCountries(),
      res,
      `Could not retrieve countries from the database`
    );
  });

  const corsOptions = {
    origin: function (origin, callback) {
      if (origin !== process.env.CORS_ORIGIN_URL) {
        callback("Not allowed", false);
      } else {
        callback(null, true);
      }
    },
    preflightContinue: true,
  };

  app.options("/rest/release", cors(corsOptions));

  app.post("/rest/release", cors(corsOptions), (req, res) => {
    handler(
      dBConnection.addRelease(req.body),
      res,
      "Could not add release to the database"
    );
  });

  app.put("/rest/release", cors(corsOptions), (req, res) => {
    handler(
      dBConnection.updateRelease(req.body),
      res,
      `Could not update release ${req.body.id}`
    );
  });

  app.get("/rest/tracks", (req, res) => {
    const { release_id } = req.query;
    handler(
      dBConnection.getReleaseTracks(release_id),
      res,
      `Could not retrieve tracks of release with id ${release_id} from the database`
    );
  });

  app.get("/rest/compositions", (_, res) => {
    handler(
      dBConnection.getCompositions(),
      res,
      `Could not retrieve compositions from the database`
    );
  });

  app.options("/rest/login", cors({ origin: true }));
  app.post("/rest/login", (req, res) => {
    const { password } = req.body;

    if (password === process.env.PASSWORD) {
      successHandler(res)({ authenticated: true });
    } else {
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(403)
        .json({ authenticated: false });
    }
  });

  app.get("/rest/dump", (req, res) => {
    const { table } = req.query;

    handler(
      () =>
        dBConnection
          .dump(table)
          .then(() => `Table '${table}' has been seeded succesfully`),
      res,
      `Could not dump table '${table}' to csv. Did you spell the name of the table right?`
    );
  });

  app.get("/rest/dump/all", (_, res) => {
    const tables = [
      "artists",
      "types",
      "formats",
      "labels",
      "countries",
      "entries",
      "releases",
      "non_queen",
      "movies",
    ];
    const dumpTables = (table) =>
      dBConnection
        .dump(table)
        .then(() => `Table '${table}' has been seeded succesfully`);

    handler(
      () => Promise.all(tables.map(dumpTables)),
      res,
      `There has been an error in data dumping`
    );
  });

  app.get("/rest/non_queen", (_, res) =>
    handler(
      useJsons
        ? getNonQueenEntriesFromJSON
        : dBConnection.getNonQueenCollection(),
      res,
      `Could not retrieve non-queen related collection from the database`
    )
  );

  app.get("/rest/movies", (_, res) =>
    handler(
      dBConnection.getMovies(),
      res,
      `Could not retrieve non-queen related collection from the database`
    )
  );

  return app;
};

type DataGetter = (path: string) => dbQueryFunc;

const getJSONData: DataGetter = (path: string) => () => {
  return new Promise((resolve, reject) => {
    readFile(`data/${path}.json`, { encoding: "utf8" }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const getNonQueenEntriesFromJSON: dbQueryFunc = async () => {
  const data = await getJSONData("non_queen_collection")();

  console.log("Got data");

  return data
    .map(({ artist, releases }) =>
      releases.map((r) => ({ ...r, artist_name: artist }))
    )
    .flat();
};
