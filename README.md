# tes-coding-task
Tennis Game

This is a simple "tennis" game implemented using the "create-react-app" boilerplate generator tool, with added redux support ( action logging / redux dev tool debugging included ). State persistence is also optional if  you uncomment the loadState() function found in configureStore.

The server is running express and handles game creation, updating of scores etc.

it allows for a dynamic amount of courts using createNewGame() found in the \react_client\src\TennisGame\GameContainer component, with each court handling its own state ( Mananaged through the server )

Installation:

`
1 ) cd react_client > run "yarn / npm install"

2)  cd server > run "yarn / npm install"
`

Run Game

`
1 ) cd into both the react_client and server and type "yarn start" or "npm run start" on both the client and server code

2 ) Open browser > localhost:3000 ( Should open automatically )
`
