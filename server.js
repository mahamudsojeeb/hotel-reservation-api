const express = require("express");
const app = express();
const cors = require("cors");


const api_redirect_path = require("./api/api")
const port = process.env.PORT || 3000;
const api_version = 1.0;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api', api_redirect_path);

app.get('/status-code', (req, res) => {
    return res.status(200).send({
        "status": 200,
        'message': "error status code",
        "success": true,
        "api v": api_version,
        "data": {
            result: [
                { "code": 200, "details": "Everything is fine" },
                { "code": 201, "details": "Everything is fine and resource is created" },
                { "code": 304, "details": "Resource is not modified" },
                { "code": 400, "details": "Bad request for request format" },
                { "code": 401, "details": "You are not authorized to access this resource" },
                { "code": 403, "details": "No access to this resource" },
                { "code": 404, "details": "Resource not found" },
                { "code": 405, "details": "Method is not goog" },
                { "code": 409, "details": "Duplicate entry error" },
                { "code": 500, "details": "Internal server error" },
                { "code": 503, "details": "Server is not available now" },
            ]
        },
    })
});



app.get('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route get",
        "success": false,
        "api v": api_version
    })
});


app.post('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route post",
        "success": false,
        "api v": api_version
    })
});

app.patch('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route patch",
        "success": false,
        "api v": api_version
    })
});

app.put('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route put",
        "success": false,
        "api v": api_version
    })
});

app.delete('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route delete",
        "success": false,
        "api v": api_version
    })
});

app.listen(port, async () => {
    console.log(`Login App running port ${port}`);
});

