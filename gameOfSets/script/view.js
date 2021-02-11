//Using revealing design pattern

// creates a view object
const view = ( () => {
    // change the point to 95% if player chose invalid set
    const penaltyPointRatio = 0.95;
    // loads and caches DOM elements here
    const cardContainer = $(".card-container");
    const cardDisplayContainer = $(".card-display-container");
    const loaderContainer = $("#loader-container");
    const player1PreviousRoundTime = $("#player1-previous-round-time");
    const player1TotalTime = $("#player1-total-time");
    const player2PreviousRoundTime = $("#player2-previous-round-time");
    const player2TotalTime = $("#player2-total-time");
    const player1SetList = $(".player1-list");
    const player2SetList = $(".player2-list");
    const cardLimitPopup = $(".card-limit-popup-container");
    const insufficientCardPopup = $(".insufficient-card-popup-container");
    const noMoreCardPopup = $(".no-more-card-popup-container");
    const limitBtn = $(".limit-btn");
    const insufficientBtn = $(".insufficient-btn");
    const noMoreBtn = $(".no-more-btn");

    // used to display popup if more than 3 cards are selected
    function displayCardLimitPopup(){
        $(cardLimitPopup).css({
            "display" : "flex"
        });
    }

    // used to display popup if less than 3 cards are selected at the time of evaluation
    function displayInsfcntPopup(){
        $(insufficientCardPopup).css({
            "display" : "flex"
        })
    }    

    // used to display popup if no more cards are in the deck
    function displayNoCardPopup(){
        $(noMoreCardPopup).css({
            "display" : "flex"
        })
    }   

    // used to hide popups
    function hideCardLimitPopup(){
        $(cardLimitPopup).css({
            "display" : "none"
        })
        $("body").css({
            "overflow" : "scroll"
        })
    }

    function hideInsfcntPopup(){
        $(insufficientCardPopup).css({
            "display" : "none"
        })
        $("body").css({
            "overflow" : "scroll"
        })
    }  

    function hideNoCardPopup(){
        $(noMoreCardPopup).css({
            "display" : "none"
        })
        $("body").css({
            "overflow" : "scroll"
        })
    }

    // used to update total card number in HTML
    function showCardAmount(){
        $("#total-cards").html(model.getCardObjArr().length);
    }

    // add visual effect to player's turn
    function showTurn(){
        if(model.player1.myTurn){
            $(".player1-info p").css({
                "color" : "tomato",
                "font-weight" : "bold"  
            });
            $(".player2-info p").css({
                "color" : "black",
                "font-weight" : 'normal'
            })
        } else if(model.player2.myTurn){
            $(".player2-info p").css({
                "color" : "red",
                "font-weight" : "bold"
            });
            $(".player1-info p").css({
                "color" : "black",
                "font-weight" : "normal"
            })
        }
    }

    function startGame(){
        // removes loading page
        loaderContainer.remove();
        // appendding starting button
        const startButton = document.createElement("button");
        $(startButton).addClass("startButton");
        $(startButton).text("Start Game!");
        $('#landing-page').append(startButton);
        $(startButton).on('click' , () => {
            $('#landing-page').css({
                "display" : "none"
            });
            $(".game-container").css({
                "display" : "block"
            });
            model.initialTime = (new Date()).getTime();
        });
    }

    // adds more cards if 3 or more cards left in the deck, show popup otherwise;
    function addCards(){
        if (model.getCardObjArr().length >= 3) {
            controller.addMoreCards();
        } else {
            displayNoCardPopup();
        }
    }
    
    // rest everything and calls gameoverpage and winnerpage
    function endGame(){
        $('.card-container').removeClass("selected-card");
        $('.card-container').remove();
        while(model.getCardObjArr().length > 0){
            model.removeFromCardObjArr(0);
        }

        while(model.getDisplayedCardArr().length > 0){
            model.removeFromDisplayedCardArr(0)
        }

        while(model.getSelectedCardObjArr().length > 0){
            model.removeFromSelectedCardArr(0)
        }
        if(($(".card-display-container").find(".game-over-page").length) === 0){
            createGameOverPage();
            createWinnerPage();
        } else {
            return;
        }
    }

    // generate hint and add visual effects to the cards.
    function generateHint(){
        let matchingCardsIndex = getMatchingCardsIndex(model.getDisplayedCardArr());
        if(matchingCardsIndex.length > 0){
            $($(".card-container")[matchingCardsIndex[0]]).addClass("hint")
            $($(".card-container")[matchingCardsIndex[1]]).addClass("hint")
            $($(".card-container")[matchingCardsIndex[2]]).addClass("hint")
        } else {
            $(".quick-popup").fadeIn(100,function(){
                $(this).fadeOut(1500)
            });
        }
    }

    // return true if exactly 3 cards are selected, return false otherwise
    function checkEnoughCardsSelected(){
        let enoughCard = false;
        if (model.getSelectedCardObjArr().length !== 3) {
            displayInsfcntPopup();
            while (model.getSelectedCardObjArr().length > 0) {
                model.removeFromSelectedCardArr(0);
            }
            $('.selected-card').removeClass('selected-card');
        } else {
            enoughCard = true;
        }
        return enoughCard;
    }

    function processPlayer1Turn(evalResult, timeAtEvaulation){
        // if player1 chose a valid set
        if (evalResult) {
            // remove these cards from the data
            for (let i = 0; i < (model.getSelectedCardObjArr()).length; i++) {
                const removalIndex = (model.getDisplayedCardArr()).indexOf(model.getSelectedCardObjArr()[i]);
                model.removeFromDisplayedCardArr(removalIndex);
                ($(".card-container")[removalIndex]).remove();
            }
            // create a history log for this set
            controller.createPlayer1SetList((model.getSelectedCardObjArr()));
            // remove the selected cards from data
            while (model.getSelectedCardObjArr().length > 0) {
                model.removeFromSelectedCardArr(0);
            }
            // increments set attribtue for calculation purpose
            model.player1.set++;
            controller.addMoreCards();
        } else {
            // remove selected cards from data if this set is invaild
            while (model.getSelectedCardObjArr().length > 0) {
                model.removeFromSelectedCardArr(0);
            }
            $('.selected-card').removeClass('selected-card')
        }
        // calculating time and score
        model.player1.previousRoundTimeUsed = (model.initialTime - timeAtEvaulation) / 1000 * (-1);
        (model.player1.previousRoundTimeUsed).toFixed(3);
        model.player1.totalTimeUsed += model.player1.previousRoundTimeUsed;
        // switch turn 
        model.player1.myTurn = false;
        model.player2.myTurn = true;
        // if player chose an invalid set, apply penalty, else no
        if (!evalResult) {
            model.player1.score = (Math.round((Math.ceil(0.8 * model.player1.set)) / (0.2 * model.player1.totalTimeUsed))) * penaltyPointRatio;
        } else {
            model.player1.score = (Math.round(Math.ceil((0.8 * model.player1.set)) / (0.2 * model.player1.totalTimeUsed))) * 1000;
        }
        updatePlayer1Info();
    }

    function processPlayer2Turn(evalResult, timeAtEvaulation) {
        // same as player1
        if (evalResult) {
            for (let i = 0; i < (model.getSelectedCardObjArr()).length; i++) {
                const removalIndex = (model.getDisplayedCardArr()).indexOf(model.getSelectedCardObjArr()[i]);
                model.removeFromDisplayedCardArr(removalIndex);
                ($(".card-container")[removalIndex]).remove();
            }
            controller.createPlayer2SetList((model.getSelectedCardObjArr()))
            while (model.getSelectedCardObjArr().length > 0) {
                model.removeFromSelectedCardArr(0);
            }
            model.player2.set++;
            controller.addMoreCards();
        } else {
            while (model.getSelectedCardObjArr().length > 0) {
                model.removeFromSelectedCardArr(0);
            }
            $('.selected-card').removeClass('selected-card')
        }
        model.player2.previousRoundTimeUsed = (timeAtEvaulation - model.initialTime) / 1000;
        (model.player2.previousRoundTimeUsed).toFixed(3);
        model.player2.totalTimeUsed += model.player2.previousRoundTimeUsed;
        model.player2.myTurn = false;
        model.player1.myTurn = true;
        if (!evalResult) {
            model.player2.score = (Math.round(Math.ceil((0.8 * model.player2.set)) / (0.2 * model.player2.totalTimeUsed))) * penaltyPointRatio;
        } else {
            model.player2.score = (Math.round(Math.ceil((0.8 * model.player2.set)) / (0.2 * model.player2.totalTimeUsed))) * 1000;
        }
        updatePlayer2Info();
    }
    // updates board, winner status, round count, time stamp, and check for winner/gameover page.
    function updateTurn(){
        // check winner
        model.getWinner();

        // update player turn with visual effct
        showTurn();
        model.round++;
        // call this function to see if there are no cards left in the game.
        createGameOverPage();
        createWinnerPage();
        // rest time stamp
        model.initialTime = (new Date()).getTime();
    }

    // core of this game
    // needs to be refactored
    function getReady(){
        // start the game
        startGame();
        controller.setupBoard();
        showTurn();

        limitBtn.on("click", () => {
            hideCardLimitPopup();
        })
        insufficientBtn.on("click", () => {
            hideInsfcntPopup();
        })
        noMoreBtn.on("click", () => {
            hideNoCardPopup();
        })

        // mainly calls evaluate function from controller
        $("#evaluate").on("click",() => {
            // show popup if less than 3 cards are selected
            if( !checkEnoughCardsSelected() ){
                return;
            }
            // creates time stamp immediately
            const timeAtEvaulation = (new Date()).getTime();
            const evalResult = (controller.evaluate( (model.getSelectedCardObjArr()) ));

            // manipulate player data
            if(model.player1.myTurn){
                processPlayer1Turn(evalResult, timeAtEvaulation);
            } else if(model.player2.myTurn){
                processPlayer2Turn(evalResult, timeAtEvaulation);
            }
            updateTurn();
        });

        // adds card when button clicked
        $("#add-cards").on('click', () => {
            addCards();
        });

        // show end game page
        $("#end-game").on('click', () => {
            endGame();
        })

        // generates hint
        $("#hint").on("click", () => {  
            $(cardContainer).removeClass("hint");
            generateHint();
        })

        // update card total anytime a button is clicked, which could potentially change the main card array
        $("button").on("click",()=>{
            showCardAmount();
        })
    }

    //returns an array that contains the indicies of cards that form a set
    function getMatchingCardsIndex(displayedCardArr){
        // returned array
        const matchingCardsIndex = [];
        // used to terminate loop
        let setFound = false;
        // used for storage during each iteration
        let tempArr = [];
        // 3 loops to check 3 cards
        for(let i =0; i < displayedCardArr.length && !setFound; i++){
            for(let j = i + 1; j < displayedCardArr.length && !setFound; j++){
                for(let k = j + 1; k < displayedCardArr.length && !setFound; k++){
                    tempArr.push(displayedCardArr[i]);
                    tempArr.push(displayedCardArr[j]);
                    tempArr.push(displayedCardArr[k]);
                    setFound = controller.evaluate(tempArr);
                    if(!setFound) {
                        tempArr = [];
                    } else {
                        matchingCardsIndex.push(i);
                        matchingCardsIndex.push(j);
                        matchingCardsIndex.push(k);
                    }
                }
            }
        }
        return matchingCardsIndex;
    }

    // generate game over page
    function createGameOverPage(){
        // restyle game container
        if(model.getDisplayedCardArr().length === 0){
            $(".card-display-container").css({
                "height" : "420px",
                "overflow" : "hidden"
            })

            // creates a div and append it to the game container
            const gameOverPage = document.createElement("div");
            $(gameOverPage).addClass("game-over-page");
            const firstPChild = document.createElement("p");
            const secondPChild = document.createElement("p");
            $(firstPChild).text("Game Over!");
            $(secondPChild).text("No more cards left in the deck.");
            $(gameOverPage).append(firstPChild);
            $(gameOverPage).append(secondPChild);
            $('.card-display-container').append(gameOverPage);
        }
    }

    function createWinnerPage(){
        if(model.getDisplayedCardArr().length === 0){
            const winnerPage = document.createElement("div");
            $(winnerPage).addClass("winner-page");
            const winnerPara = document.createElement("p");
            const winnerChar = document.createElement("span");
            $(winnerChar).text(model.getWinner());
            $(winnerChar).css({
                "color": "rgb(255, 140, 0)",
                "font-weight": "bold",
                "text-decoration": "underline"
            })
            const winnerTotalTime = document.createElement("p");
            const winnerScore = document.createElement("p");
            $(winnerPara).text("Congratulations! Winner is ");
            $(winnerPara).append(winnerChar);
            if (((model.getWinner())).indexOf("1") >= 0) {
                $(winnerTotalTime).text((model.getWinner()) + " total time used: " + model.player1.totalTimeUsed + "s");
                $(winnerScore).text((model.getWinner()) + " score is " + model.player1.score + " points");
            } else {
                $(winnerTotalTime).text((model.getWinner()) + " total time used: " + model.player2.totalTimeUsed + "s");
                $(winnerScore).text((model.getWinner()) + " score is " + model.player2.score + " points");
            }
            $(winnerPage).append(winnerPara);
            $(winnerPage).append(winnerTotalTime);
            $(winnerPage).append(winnerScore);
            $('.card-display-container').append(winnerPage);
        }
    }

    // update player1 info
    function updatePlayer1Info(){
        player1PreviousRoundTime.html( (model.player1.previousRoundTimeUsed) + "s" );
        player1TotalTime.html( (model.player1.totalTimeUsed) + "s" );
    }

    // update player2 info
    function updatePlayer2Info(){
        player2PreviousRoundTime.html( (model.player2.previousRoundTimeUsed) + "s" );
        player2TotalTime.html( (model.player2.totalTimeUsed) + "s" );
    }

    function getCardContainers(){
        return cardContainer;
    }

    function getDisplayCardContainer(){
        return cardDisplayContainer;
    }

    return {
        getReady : getReady,
        getCardContainers : getCardContainers,
        getDisplayCardContainer : getDisplayCardContainer,
        player1SetList : player1SetList,
        player2SetList : player2SetList,
        displayCardLimitPopup : displayCardLimitPopup
    }
} )()