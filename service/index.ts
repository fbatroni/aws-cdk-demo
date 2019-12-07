import * as express from "express";
import * as aws from "aws-sdk";
import { s3Bucket } from "../config";

const app = express();

app.get('/', (req, res) => {
    res.json({ msg: "WORKING!!!" })
})

app.get('/write', async (req, res) => {
    try {
        const s3 = new aws.S3();
        await s3.putObject({ Body: "test", Bucket: s3Bucket, Key: "123.txt" }).promise()
        res.json({ msg: "wrote to s3" })
    } catch (e) {
        res.status(500).json({ error: e.msg })
    }
})

app.listen(8080);