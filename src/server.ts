import express from "express";
import cors from "cors";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

const PORT = process.env.PORT ?? 4000;

const client = new Client({ database: 'testDB' });

//TODO: this request for a connection will not necessarily complete before the first HTTP request is made!
client.connect();


const app = express();

/**
 * Simplest way to connect a front-end. Unimportant detail right now, although you can read more: https://flaviocopes.com/express-cors/
 */
app.use(cors());

/**
 * Middleware to parse a JSON body in requests
 */
app.use(express.json());

app.get("/injection/:id", async (req, res) => {
  // :id indicates a "route parameter", available as req.params.id
  //  see documentation: https://expressjs.com/en/guide/routing.html
  // result.rows = []
  let result = {}
  // result.rows = {}[]
  try {
    const id = req.params.id; // params are always string type
    result = await client.query(`select * from testdb where id = $1`, [id])   //FIXME-TASK get the signature row from the db (match on id)
    // const isResult = result.rows.length === 1;
    // if (!isResult) {
    //   res.send("Could not find that id")
    // }
  }
  catch (e) {
    res.send("Are you a criminal?")
    console.log("Error")
  }
  finally {
    res.send(JSON.stringify(result))
  }
});



//   const isResult = result.rowCount === 1;

//   if (isResult) {
//     res.status(200).json({
//       status: "success",
//       data: result.rows
//     });
//   } else {
//     res.status(404).json({
//       status: "fail",
//       data: {
//         id: "Could not find a result with that id identifier",
//       },
//     });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

export default app;
