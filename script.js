(function() {
   const game = {
            board: [["", "", ""],
                    ["", "", ""],
                    ["", "", ""]],
            players: [],
            turn: 0,
            winnerFound: false,
            newGame: function () {
                this.reset();
                this.playerSetup();
                this.render();
                while (!this.winnerFound) {
                    this.simulateTurn();
                    this.render();
                    this.checkWin();
                }
            },
            simulateTurn: function() {
                let currentPlayer = this.players[this.turn];

                let row = prompt(`${currentPlayer.name}, enter row:`);
                let column = prompt(`${currentPlayer.name}, enter column:`);

                currentPlayer.makeMove(row, column);
                this.turn = this.turn == 0 ? 1 : 0;
            },
            playerSetup: function() {
                const player1 = prompt("Player 1, enter your name: ");
                const player2 = prompt("Player 2, enter your name: ");
                this.addPlayer(player1, "X");
                this.addPlayer(player2, "O");
            },
            render: function () {
                console.table(this.board);
            },
            MakePlayer: function (name, symbol) {
                this.name = name;
                this.symbol = symbol;
                this.makeMove = function(row, col) {
                    game.board[row][col] = this.symbol;
                }
            },
            addPlayer: function (name, symbol) {
                this.players.push(new this.MakePlayer(name, symbol));
            },
            reset: function() {
                this.board = [["", "", ""],["", "", ""],["", "", ""]];
                this.players = [];
                this.turn = 0;
                this.winnerFound = false;
            },
            checkWin: function() {
                let winningSymbol;
                for (let i = 0; i < 3; i++) {
                    //check rows
                    if (this.board[i][0] === this.board[i][1]
                        && this.board[i][1] === this.board[i][2]
                        && this.board[i][0] !== "") {
                            winningSymbol = this.board[i][0];
                            break;    
                    }
                    // check columns
                    else if (this.board[0][i] === this.board[1][i]
                        && this.board[1][i] === this.board[2][i]
                        && this.board[0][i] !== "") {
                            winningSymbol = this.board[0][i];
                            break;    
                    } 
                }
                // check diagonals
                if (this.board[1][1] !== ""
                    && (this.board[0][0] === this.board[1][1] &&
                        this.board[1][1] === this.board[2][2])
                    || (this.board[0][2] === this.board[1][1] &&
                        this.board[1][1] === this.board[2][0])) {
                            winningSymbol = this.board[1][1];
                        }
                
                if(winningSymbol) return this.findWinner(winningSymbol);
                return false;
            },
            findWinner: function(symbol) {
                let winner =  this.players.filter(player => player.symbol === symbol)[0];
                this.winnerFound = true;
                console.log(`${winner.name} has won the game!`);
            },
    }
    game.newGame();
})()
