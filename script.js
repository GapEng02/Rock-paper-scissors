// Type definitions & Game Implementation (compiled from TypeScript)
class RockPaperScissorsGame {
    constructor() {
        this.state = { wins: 0, draws: 0, losses: 0 };
        this.initDOM();
        this.loadGameData();
        this.attachEventListeners();
    }
    initDOM() {
        this.playerImg = document.getElementById("playerImg");
        this.computerImg = document.getElementById("computerImg");
        this.playerLabel = document.getElementById("playerChoiceLabel");
        this.computerLabel = document.getElementById("computerChoiceLabel");
        this.resultDiv = document.getElementById("resultMessage");
        this.winsSpan = document.getElementById("winsCount");
        this.drawsSpan = document.getElementById("drawsCount");
        this.lossesSpan = document.getElementById("lossesCount");
        this.winPercentSpan = document.getElementById("winPercent");
    }
    async loadGameData() {
        try {
            const response = await fetch("data.json");
            this.gameData = await response.json();
            console.log("✅ Game data loaded from JSON:", this.gameData);
            this.setDefaultImages();
        }
        catch (error) {
            console.error("❌ Failed to load data.json:", error);
            this.resultDiv.textContent = "⚠️ Failed to load game data!";
        }
    }
    setDefaultImages() {
        if (this.gameData) {
            this.playerImg.src = this.gameData.images.rock;
            this.computerImg.src = this.gameData.images.rock;
            this.playerLabel.textContent = "Rock";
            this.computerLabel.textContent = "Rock";
        }
    }
    getRandomMove() {
        const moves = this.gameData.moves;
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }
    determineWinner(player, computer) {
        if (player === computer)
            return "draw";
        return this.gameData.rules[player].beats === computer ? "win" : "lose";
    }
    updateScoreUI() {
        this.winsSpan.textContent = this.state.wins.toString();
        this.drawsSpan.textContent = this.state.draws.toString();
        this.lossesSpan.textContent = this.state.losses.toString();
        const totalDecided = this.state.wins + this.state.losses;
        if (totalDecided === 0) {
            this.winPercentSpan.textContent = "N/A";
        }
        else {
            const percent = (this.state.wins / totalDecided) * 100;
            this.winPercentSpan.textContent = `${percent.toFixed(1)}%`;
        }
    }
    updateVisuals(player, computer) {
        this.playerImg.src = this.gameData.images[player];
        this.computerImg.src = this.gameData.images[computer];
        this.playerLabel.textContent = player.charAt(0).toUpperCase() + player.slice(1);
        this.computerLabel.textContent = computer.charAt(0).toUpperCase() + computer.slice(1);
        this.playerImg.alt = `Player chose ${player}`;
        this.computerImg.alt = `Computer chose ${computer}`;
    }
    getResultMessage(result, player, computer) {
        const messages = this.gameData.messages;
        switch (result) {
            case "win":
                return messages.win
                    .replace("{player}", player.charAt(0).toUpperCase() + player.slice(1))
                    .replace("{computer}", computer.charAt(0).toUpperCase() + computer.slice(1));
            case "lose":
                return messages.lose
                    .replace("{player}", player.charAt(0).toUpperCase() + player.slice(1))
                    .replace("{computer}", computer.charAt(0).toUpperCase() + computer.slice(1));
            case "draw":
                return messages.draw.replace("{move}", player.charAt(0).toUpperCase() + player.slice(1));
            default:
                return "Round completed!";
        }
    }
    playRound(playerChoice) {
        if (!this.gameData) {
            this.resultDiv.textContent = "⏳ Game data still loading...";
            return;
        }
        const computerChoice = this.getRandomMove();
        const result = this.determineWinner(playerChoice, computerChoice);
        switch (result) {
            case "win":
                this.state.wins++;
                break;
            case "lose":
                this.state.losses++;
                break;
            case "draw":
                this.state.draws++;
                break;
        }
        this.updateVisuals(playerChoice, computerChoice);
        const message = this.getResultMessage(result, playerChoice, computerChoice);
        this.resultDiv.textContent = message;
        this.updateScoreUI();
    }
    resetGame() {
        this.state = { wins: 0, draws: 0, losses: 0 };
        this.updateScoreUI();
        this.setDefaultImages();
        this.resultDiv.textContent = "🔄 Game reset! Make your move.";
    }
    attachEventListeners() {
        const buttons = document.querySelectorAll("[data-move]");
        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                const move = e.target.getAttribute("data-move");
                if (move && this.gameData?.moves.includes(move)) {
                    this.playRound(move);
                }
            });
        });
        const resetBtn = document.getElementById("resetBtn");
        resetBtn?.addEventListener("click", () => this.resetGame());
        window.addEventListener("keydown", (e) => {
            const key = e.key;
            if (key === "1")
                this.playRound("rock");
            else if (key === "2")
                this.playRound("paper");
            else if (key === "3")
                this.playRound("scissors");
            else if (key === "r" || key === "R")
                this.resetGame();
        });
    }
}
// Initialize game when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new RockPaperScissorsGame();
});