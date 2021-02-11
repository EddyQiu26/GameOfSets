//Using revealing design patter
// creates model obj
const model = ( () => {
    // data structures initialized here
    const cardObjArr = [];
    const displayedCard = [];
    const selectedCards = [];
    let initialTime;
    let round = 1;
    let winner = "Draw"; 
    // player1 obj
    const player1 = {
        myTurn : true,
        previousRoundTimeUsed : 0,
        totalTimeUsed : 0,
        set : 0,
        score : 0
    }

    // player2 obj
    const player2 = {
        myTurn : false,
        previousRoundTimeUsed : 0,
        totalTimeUsed : 0,
        set : 0,
        score : 0
    }

    // returns a winner string
    function getWinner(){
        if(player1.score > player2.score){
            winner = "Player1"
        } else if(player2.score > player1.score){
            winner = "Player2";
        } else {
            winner = "Draw"
        }
        return winner;
    }

    // add card obj to selection array
    function addCardObjToSelectedCardArr(cardObj){
        selectedCards.push(cardObj);
    }

    // add card to main card array - 81 cards
    function addCardObj(cardObj){
        cardObjArr.push(cardObj);
    }

    // remove the card at @param(index) from the main card array
    function removeFromCardObjArr(index){
        cardObjArr.splice(index,1);
    }

    // remove the card at @param(index) from display array
    function removeFromDisplayedCardArr(index) {
        displayedCard.splice(index,1);
    }

    // remove the card at @param(index) from selection array
    function removeFromSelectedCardArr(index){
        selectedCards.splice(index, 1)
    }

    // return main array
    function getCardObjArr(){
        return cardObjArr;
    }

    // return display array
    function getDisplayedCardArr(){
        return displayedCard;
    }

    // return selection array
    function getSelectedCardObjArr(){
        return selectedCards;
    }

    // shuffles the main array
    function shuffleArray(){
        let counter = cardObjArr.length;
        while(counter > 0){
            const randomIndex = Math.floor(Math.random() * cardObjArr.length);
            counter--;
            const temp = cardObjArr[counter];
            cardObjArr[counter] = cardObjArr[randomIndex];
            cardObjArr[randomIndex] = temp;
        }
    }

    // add card obj to display array
    function addCardObjToDisplayedArr(cardObj){
        displayedCard.push(cardObj)
    }

    // insert a card obj at a specific position of display array
    function insertIntoDisplayedCardArr(cardObj, index){
        displayedCard.splice(index,0,cardObj)
    }

    return {
        addCardObj : addCardObj,
        getCardObjArr : getCardObjArr,
        addCardObjToSelectedCardArr : addCardObjToSelectedCardArr,
        removeFromCardObjArr : removeFromCardObjArr,
        getDisplayedCardArr : getDisplayedCardArr,
        getSelectedCardObjArr : getSelectedCardObjArr,
        shuffleArray : shuffleArray,
        addCardObjToDisplayedArr : addCardObjToDisplayedArr,
        removeFromDisplayedCardArr : removeFromDisplayedCardArr,
        insertIntoDisplayedCardArr : insertIntoDisplayedCardArr,
        removeFromSelectedCardArr : removeFromSelectedCardArr,
        player1 : player1,
        player2 : player2,
        initialTime : initialTime,
        round : round,
        getDisplayedCardArr : getDisplayedCardArr,
        getWinner : getWinner
    }

} )()