const random = (n)=> Math.floor(Math.random()*(n+1));
const $ = x=> document.querySelector(x);
const l = x=> console.log(x);
const container = document.querySelector(".container");
const pcCheck = document.querySelector("#PC");

pcCheck.addEventListener('change',(event)=>{
    if(event.currentTarget.checked){game.pc = true}
    else {game.pc = false}
})

const game = (()=>{
    let currentPlayer,player1,pc,score = {'O':0,'X':0};
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
            box.addEventListener('click',UIEventHandler,{once:true});
            grid.appendChild(box);
        };
        container.innerHTML = `<p class="turn">Player ${currentPlayer}'s Turn</p>`;
        container.appendChild(grid);
    return 'Initialized'}

    const UIEventHandler = (e) => {
        if(e.target===e.currentTarget){
            mark(currentPlayer,e.target.index);
            e.target.textContent = currentPlayer;}
        return true;
    }

    const updateTurn = () => {
        if(!$('.turn')){return true;}
        $('.turn').textContent = `Player ${currentPlayer}'s Turn`;
    }
    
    const mark = (player,index)=>{
        board[index] = board[index] || player;
        setTimeout(() => {
            currentPlayer = ['X','O'].find(x=>x!==player);
            updateTurn();
        }, 1);
        if(checkWinner()){return true};
        if (game.pc){
            setTimeout(() => {
                playPC();
                checkWinner();
            }, 2);
        };
        return 'Marked';
    }
    const availableMoves = ()=> board.reduce((y,x,i)=> !x ? y.concat(i):y,[]);

    const playPC = ()=> {
        if(availableMoves().length>0){
            let index = availableMoves()[random(availableMoves().length-1)];
            board[index] = currentPlayer;
            let target = [...$('.board-grid').children].find(x=>x.index === index);
            target.textContent = currentPlayer;
            target.removeEventListener('click',UIEventHandler,{once:true});
        }
        setTimeout(() => {
            currentPlayer = ['X','O'].find(x=>x!==currentPlayer);
            updateTurn();
        }, 1); 
        return "PC played";
    }
    const checkWinner = ()=>{
        let matrix = [board.slice(0,3).join(''),board.slice(3,6).join(''),board.slice(6,9).join('')].toString();
        let pattern = [
                       /(X|O)\1\1/ig,
                       /(X|O)\w\w,\1\w\w,\1\w\w/ig,
                       /\w\w(X|O),\w\w\1,\w\w\1/ig,
                       /\w(X|O)\w,\w\1\w,\w\1\w/ig,
                       /(X|O)\w\w,\w\1\w,\w\w\1/ig,
                       /\w\w(X|O),\w\1\w,\1\w\w/ig
                    ];
        pattern = pattern.find(x=>x.test(matrix));
        if(pattern){
            end(matrix.match(pattern)[0].replace(pattern,"$1"));
            return true;
        };
        if(availableMoves().length<1){draw();return true};
        return false;
    }
    const start = (player = player1)=>{
        initialize();
        player1=player;
        currentPlayer = player1;
        updateTurn();
        return 'Game started';
    }
    const end = winner => {
        score[winner]++;
        let ResultScreen = document.createElement('div');
        ResultScreen.className = "result";
        ResultScreen.innerHTML = `<p><span>${winner}</span> is Winner<br><br>
                                    Results:<br> 
                                    ${score['X']>=score['O']?
                                    ('X : '+score['X']+'<br>O : '+score['O']):
                                    ("O : "+score['O']+'<br>X : '+score['X'])}
                                    <br>
                                    <div class="button" onclick="game.start()">Play Again</div>`;
        container.innerHTML = '';
        container.appendChild(ResultScreen);
        return 'Game ended';
    }
    const draw = () => {
        let ResultScreen = document.createElement('div');
        ResultScreen.className = "result";
        ResultScreen.innerHTML = `<p>Draw! Board full<br>
                                     Out of Moves<br>
                                    Results:<br><br>
                                    ${score['X']>=score['O']?
                                    ('X : '+score['X']+'<br>O : '+score['O']):
                                    ("O : "+score['O']+'<br>X : '+score['X'])}
                                    <br>
                                    <div class="button" onclick="game.start()">Play Again</div>`;
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