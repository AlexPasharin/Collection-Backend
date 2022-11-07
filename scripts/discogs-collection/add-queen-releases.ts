import { dbConnection } from "../../src/db";

import { mainJob } from "./main";

const connection = new dbConnection();

const BATCHSIZE = 50;
const batches = 14;

const offset = 10 * 4 + BATCHSIZE * batches;

connection.getAllReleases({ batchSize: BATCHSIZE, skip: offset }).then(mainJob);
