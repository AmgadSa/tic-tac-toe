const $ = x=> document.querySelector(x);
const container = document.querySelector(".container");
const random = (n)=> Math.floor(Math.random()*(n+1));
const pcCheck = document.querySelector("#PC");

pcCheck.addEventListener('change',(event)=>{
    if(event.currentTarget.checked){game.pc = true}
    else {game.pc = false}
})

const game = (()=>{
    let currentPlayer,player1,pc,score = {'o':0,'x':0};
    let board = [];
    let initialize = ()=>{
        board = [...Array(9).fill(0)];
        let grid = document.createElement('div');
        grid.className = "board-grid";
        container.innerHTML = '';
        for(let n=0;n<9;n++){
            let box = document.createElement('div')
            box.className = 'check-box';
            box.index = n;
            box.addEventListener('click',(e)=>{
                if(e.target===e.currentTarget){
                mark(currentPlayer,e.target.index);
                e.target.textContent = currentPlayer;}
                },{once:true});
            grid.appendChild(box);
        };
        container.innerHTML = `<p class="turn">Player ${currentPlayer}'s Turn</p>`;
        container.appendChild(grid);
    return 'Initialized'}

    const updateTurn = () => $('.turn').textContent = `Player ${currentPlayer}'s Turn`;
    
    const mark = (player,index)=>{
        board[index] = board[index] || player;
        currentPlayer = ['X','O'].find(x=>x!==player);
        updateTurn();
        if (pc){playPC()};
        checkWinner();
        return 'Marked';
    }
    const availableMoves = ()=> board.reduce((y,x,i)=> !x ? y.concat(i):y,[]);

    const playPC = ()=> {
        if(availableMoves().length>0){
            board[availableMoves[random(list.length-1)]] = currentPlayer;
        }
        currentPlayer = ['x','o'].find(x=>x!==currentPlayer);
        updateTurn();
        return "PC played";
    }
    const checkWinner = ()=>{
        let matrix = [board.slice(0,3).join(''),board.slice(3,6).join(''),board.slice(6,9).join('')].toString();
        let pattern = /(x|o)\1\1|^(x|o)\w+,\1\w+,\1\w+|\w+(x|o),\w+\1,\w+\1$|\w(o|x)\w,\w\1\w,\w\1\w|^(x|o)\w+,\w\1\w,\w+\1$|\w+(x|o),\w\1\w,\1\w+/ig;
        matrix = matrix.match(pattern);
        if(matrix){end(matrix[0].replace(pattern,"$1"))};
        if(availableMoves.lengh<1){draw()};
        return 'Checked';
    }
    const start = (player = player1)=>{
        initialize();
        player1=player;
        currentPlayer = player1;
        return 'Game started';
    }
    const end = winner => {
        score[winner]++
        let ResultScreen = document.createElement('div');
        ResultScreen.className = "result";
        ResultScreen.innerHTML = `<p><span>${winner}</span> is Winner<br><br>
                                    Results:<br> 
                                    ${score['x']>=score['o']?
                                    ('X : '+score['x']+'<br>O : '+score['o']):
                                    ("O : "+score['o']+'<br>X : '+score['x'])}
                                    <br>
                                    <div class="button" onclick="game.start()">Play Again</div>`;
        container.innerHTML = '';
        container.appendChild(ResultScreen);
        return 'Game ended';
    }
    const draw = () => {
        let ResultScreen = document.createElement('div');
        ResultScreen.className = "result";
        ResultScreen.innerHTML = `<p>Draw! Board full<br><br>
                                     Out of Moves<br>
                                    Results:<br> 
                                    ${score['x']>=score['o']?
                                    ('X : '+score['x']+'<br>O : '+score['o']):
                                    ("O : "+score['o']+'<br>X : '+score['x'])}
                                    <br>
                                    <div class="button" onclick="game.start()">restart</div>`;
        container.innerHTML = '';
        container.appendChild(ResultScreen);
        return 'Draw';
    }
    return {start,pc}
})();

/* Style manuplation */

const root = $(':root');
((c = random(255))=>{
    root.style.setProperty('--main-color',`hsl(${c},45%,80%)`);
    root.style.setProperty('--main-background',`hsl(${c},45%,60%)`);
})();