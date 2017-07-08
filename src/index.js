const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const HashMap = require('hashmap');

var teams = new HashMap();

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.htm");
});

app.get('/teams', function (req, res) {
    res.sendFile(__dirname + "/teamPage.html");
});

app.post('/sessioncreate/', function (req, res) {
    let teamname = req.body.teamname;
    if (teamname != undefined) {
        console.log('Creating team ' + teamname);
        let data = {
            teamsize: {
                number: 0,
                type: 'Not defined'
            }
        };
        teams.set(teamname, data);
        res.redirect(302, '/teams/?teamname=' + teamname);
        res.status(200).end(JSON.stringify({ teamname: teamname }));
    } else {
        console.log('Creating Team: Failure because of undefined teamname!');
        res.sendStatus(400);
    }
});

app.post('/teams/teamsize/', function (req, res) {
    let count = req.body.count;
    let type = req.body.type;
    let teamname = req.body.teamname;
    if (count != undefined && type != undefined && teamname != undefined) {
        console.log('Update team size for team' + teamname);
        let data = {
            teamsize: {
                number: count,
                type: type
            }
        };
        teams.set(teamname, data);
        res.redirect(302, '/teams/?teamname=' + teamname);
    } else {
        console.log('Update team size failed');
        res.sendStatus(400);
    }
});



function saveToFile(data, filename = "tfmap.log", exitOnWrite = false) {
    let folderName = "results";
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
    fs.writeFileSync('results/' + filename, data);
    console.log("The file was saved!");
    if (exitOnWrite) {
        process.exit(0);
    }
}

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("REST server listening at http://%s:%s", host, port);
});