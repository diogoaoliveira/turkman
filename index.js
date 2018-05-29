'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import ip from 'ip';

import { readFolder } from './utils';

const app = express();

const PORT = process.env.PORT || 5000;

app.set('port', PORT);
app.set('json spaces', 4);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();

router.get('/', function(req, res) {
  const arr = readFolder(path.join(__dirname, `photos`));
  res.json({ message: 'TURKMAN API', data: arr });
});

router.route('/move').post((req, res) => {
  const actualFilePath = req.body.photoPath;
  const nextFolder = req.body.folderSelected;

  const dividedPathByDir = actualFilePath.split('/');
  const fileName = dividedPathByDir[dividedPathByDir.length - 1];

  const currentWorkingDir = path.join(__dirname, `${nextFolder}`);

  fs.move(
    actualFilePath,
    `${currentWorkingDir}/${fileName}`,
    { overwrite: true },
    err => {
      if (err) {
        console.error(err);
        return res.json({ error: err });
      }
      res.json({ message: 'Success' });
    }
  );
});

app.use('/', router);

const server = app.listen(app.get('port'), () => {
  console.log('|------------------------------------------------------\n');
  console.log(`TURKMAN API`);
  console.log(`localhost: http://localhost:${app.get('port')}/`);
  console.log(`local network: http://${ip.address()}:${app.get('port')}/`);
  console.log('\n|------------------------------------------------------');
});
