# Idea

## Endpoints

Server:

- Move
  {move: string, passcode: string, playerID: string, gameType: string, apiKey: string}
- Start
  {gameKey: string, apiKey: string, returnURL: string, gameType: string}
- JoinTournament
  - {tounamentID: string, apiKey: string}
- ChangeName
  - {apiKey: string, name: string}

Server ws:

- On open - client sends message with 'apiKey: string' and 'type: connect';
  Bot:
- GameState
  Depends on game
- GameOver
- NewGame

Gamestat

Players:

- APIkey?
-

#CLI
Options

- Begin Tournament
  - Choose number of players
  - Choose type of game
  - Choose type of tournament
    - RoundRobin
    - Single Elimination
      - Choose seeding
        - From file
        - Random
    - Double Elimination
      - Choose seeding
        - From file
        - Random
  - Choose best of
    - number
  - Choose display type
    - Simultaneous rounds
    - All at once
    - One at a time
  - Credentials
    - Accept any apiKeys
    - From file
      - .json {apiKey: string, name: string}[]
  - Choose Seeding
    - From file
      - tournament output
        - .json {apiKey: string, rank: number, name: string, results: {opponentName: string, result: 'win' | 'loss' | 'draw' }[]}[]
    - Random
  - TournamentID
    - Generate
    - Enter
      - Give particular tournamentID
  - Displays beginning tournament, tournamentID
  - Displays players connecting
  - Awaits go from user
  - Potentially awaits go between games/rounds
- Open to games
  - Open endpoints to all games
  - Accept any apiKeys
- See Tournament Results
  - List Tournaments
  - Results by name
- Change Team Details
  - ApiKey
    - Set Name
- Generate ApiKeys
  - Number to generate

TODO:

- Abstract
- Clean up
- Simplify apikeys etc
  - Centralise games?
- Timer/Timeout
- Try game with multi-step moves
  - Collect most of two suits
  - Choose from 2 decks face up
  - Need to change it to show game state on every turn
    - Have a flag that says if it is their turn or not
- Try tournament
  - How do we set amount?
  - CLI to initialise tournament - number of players, gameType
  - Players join tournament and it starts when correct number have joined
  - Random allocation
  - Seeded
  - Round Robin
- Look into Commander, and Inquirer to run
- Have a host(wrong word) feature
  - Have something that exposes the endpoints but passes them on using websockets
  - Mirrors

Players given API key at start of

- Use database to store API key + team name + returnURL
- Can update teamDetails through updateTeamDetails endpoint

Host creates tournament using CLI

- Chooses tournament type, game, turn timelimit

Players sign up for tournament using tournament ID and APIkey

- Once all have joined begin games
  - Option to do one at a time for viewing

WSS:

-

Ethan added this
