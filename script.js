const game = {
        board: [["", "", ""],
                ["", "", ""],
                ["", "", ""]],
        players: [],
        turn: 0,
        round: 9,
        symbols: ["X", "O"],
        gameOn: false,
        newGame: function () {
            this.reset();
            this.gameOn = true;
            this.playerSetup();
        },
        simulateTurn: function(row, column) {
            let currentPlayer = this.players[this.turn];
            currentPlayer.makeMove(row, column);
            this.round--;
            this.turn = this.turn == 0 ? 1 : 0;
            this.checkWin();
        },
        playerSetup: function() {
            const player1 = prompt("Player 1, enter your name: ");
            const player2 = prompt("Player 2, enter your name: ");
            this.addPlayer(player1, "X");
            this.addPlayer(player2, "O");
            dom.playerOneName.innerText = player1;
            dom.playerTwoName.innerText = player2;
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
            dom.modal.close();
            this.board = [["", "", ""],["", "", ""],["", "", ""]];
            this.players = [];
            this.turn = 0;
            this.round = 9;
            dom.resetBoard();
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
            if(this.round === 0) {
                dom.displayTie();
            }
            return false;
        },
        findWinner: function(symbol) {
            let winner = this.players.filter(player => player.symbol === symbol)[0];
            this.gameOn = false;
            dom.displayWinner(winner.name);
        },
        
};

const dom = {
    init: function() {
        this.cacheDom();        
        this.resetBoard();
        this.bindEvents();
    },
    cacheDom: function() {
        this.gameBoard = document.querySelector(".gameboard");
        this.cells = Array.from(this.gameBoard.querySelectorAll(".board-cell"));
        this.playerCards = Array.from(document.querySelectorAll(".player-card"));
        this.newGameButton = document.querySelector("#new-game-btn");
        this.playerOneName = document.querySelector(".player1-name");
        this.playerTwoName = document.querySelector(".player2-name");
        this.modal = document.querySelector("#modal");
        this.closeButton = this.modal.querySelector("#close-btn");
        this.modalNewGameButton = this.modal.querySelector("#modal-new-game-btn");
        this.resultMessage = this.modal.querySelector(".result-message");
    },
    bindEvents: function() {
        this.newGameButton.addEventListener("click", game.newGame.bind(game));
        this.gameBoard.addEventListener("click", this.handleClick.bind(this));
        this.closeButton.addEventListener("click", () => this.modal.close());
        this.modalNewGameButton.addEventListener("click", game.newGame.bind(game));
    },
    handleClick: function(event) {
        if (!game.gameOn) return -1; // early out if game has not started 

        let target = event.target;

        if (target.matches(".board-cell") && !target.classList.contains("placed")) {
            let row = target.dataset.row;
            let column = target.dataset.col;
            target.innerText = game.symbols[game.turn];
            target.classList.add("placed");
            game.simulateTurn(row, column);
            
            this.playerCards.forEach(card => card.classList.toggle("player-turn"));
        }
    },
    resetBoard: function() {
        this.cells.map(cell => {
            cell.classList.remove("placed");
            cell.innerText = "";
        })
    },
    displayTie: function() {
        this.playerCards.forEach(card => card.classList.toggle("player-turn"));
        this.resultMessage.innerHTML = `<span class="large">Game Over</span> <br><br> 🤝It's a tie 🤝`;
        this.modal.showModal();
    },
    displayWinner: function(name) {
        this.playerCards.forEach(card => card.classList.toggle("player-turn"));
        this.resultMessage.innerHTML = `<span class="large">Game Over</span> <br><br> 🎉 ${name} has won 🎉`;
        this.modal.showModal();
    }  
};

dom.init();