import { dbConnection } from "../../src/db";

import { mainJob } from "./main";

const connection = new dbConnection();

connection.getNonQueenCollection()().then(mainJob);
