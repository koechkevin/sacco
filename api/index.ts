// @ts-ignore
const express = require('express');

import { config } from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import authentication from './Authentication';
config();

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const port = process.env.PORT || 5000;
app.use('/api/auth', authentication);

const DIST = path.resolve(__dirname, '../build');
app.use(express.static(DIST));
app.use('*', (req: any, res: { sendFile: (arg0: string) => any; }) => res.sendFile(path.resolve(DIST, 'index.html')));
app.listen(port , () => {
  console.log('========>', port)
});
