class Team {
    constructor(name) {
        this.name = name;
        this.players = [];
    }

    addPlayer(name, number) {
        this.players.push(new Player(name, number));
    }
}

class Player {
    constructor(name, number) {
        this.name = name;
        this.number = number;
    }
}

class TeamService {
    static url = 'https://crudcrud.com/api/5e3877fe9683495ab81c9b38f5766841/teams';


    static getAllTeams() {
        return $.get({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(),
            contentType: 'application/json',
            crossDomain: true,
            type: 'GET'
        });
    }

    static getTeam(id) {
        return $.get({
            url: this.url + `/${id}`,
            dataType: 'json',
            data: JSON.stringify(id),
            contentType: 'application/json',
            crossDomain: true,
            type: 'GET'
        });
    }

    static createTeam(team) {
        return $.post({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(team),
            contentType: 'application/json',
            crossDomain: true,
            type: 'POST'  
        });
    }

    static updateTeam(team) {
        return $.ajax({
            url: this.url + `/${team._id}`,
            dataType: 'json',
            data: JSON.stringify(team),
            contentType: 'application/json',
            crossDomain: true,
            type: 'PUT'
        });
    }

    static deleteTeam(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            crossDomain: true,
            type: 'DELETE'
        });
    }
}



class DOMManager {
    static teams;

    static getAllTeams() {
        TeamService.getAllTeams().then(teams => this.render(teams));
    }

    static createTeam(name) {
        TeamService.createTeam(new Team(name))
            .then(() => {
                return TeamService.getAllTeams();
            })
            .then((teams) => this.render(teams));
    }

    static deleteTeam(id) {
        TeamService.deleteTeam(id)
            .then(() => {
                return TeamService.getAllTeams();
            })
            .then((teams) => this.render(teams));
    }

    static addPlayer(id) {
        for (let team of this.teams) {
            if (team._id == id) {
                team.players.push(new Player($(`#${team._id}-player-name`).val(), $(`#${team._id}-player-number`).val()));
                TeamService.updateTeam(team)
                    .then(() => {
                        return TeamService.getAllTeams();
                    })
                    .then((teams) => this.render(teams));
            }
        }
    }

    static deletePlayer(teamId, playerId) {
        for (let team of this.teams) {
            if (team._id == teamId) {
                for (let player of team.players) {
                    if (player._id == playerId) {
                        team.players.splice(team.players.indexOf(player), 1);
                        TeamService.updateTeam(team)
                            .then(() => {
                                return TeamService.getAllTeams();
                            })
                            .then((teams) => this.render(teams));
                    }
                }
            }
        }
    }

    static render(teams) {
        this.teams = teams;
        $('#app').empty();
        for (let team of teams) {
            $('#app').prepend(
                `<div id="${team._id}" class="card" style="background-color: rgb(52, 34, 131)>
                    <div class="card-header">
                        <h2 style="text-align: center">${team.name}</h2>
                        <button class="btn-danger" onclick="DOMManager.deleteTeam('${team._id}')">Delete</button>
                    </div>
                    <div class="card-body" style="background-color: rgb(52, 34, 131)>
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${team._id}-player-name" class ="form-control" placeholder="Player Name" style="text-align: center">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${team._id}-player-number" class ="form-control" placeholder="Player Number" style="text-align: center">
                                </div>
                            </div>
                            <button id="${team._id}-new-player" onclick="DOMManager.addPlayer('${team._id}')" class="btn btn-secondary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            for (let player of team.players) {
                $(`#${team._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${player._id}"><strong>Name: </strong> ${player.name}</span>
                    <span id="number-${player._id}"><strong>Number: </strong> ${player.number}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deletePlayer('${team._id}', '${player._id}')">Delete Player</button>`
                );
            }
        }
    }
}


$('#create-new-team').click(() => {
    DOMManager.createTeam($('#new-team-name').val());
    $('#new-team.name').val('');
})

DOMManager.getAllTeams();