//Using revealing design patter

// create controller 
const controller = (() => {
    //function used to pull random cards from card array
    function setupBoard() {
        for (let i = 0; i < ($(view.getCardContainers())).length; i++) {
            const randomIndex = Math.floor(Math.random() * (model.getCardObjArr()).length);
            const cardObj = (model.getCardObjArr())[randomIndex];
            model.removeFromCardObjArr(randomIndex);
            const card = document.createElement("img");
            card.src = cardObj.src;
            (view.getCardContainers())[i].append(card);
            model.addCardObjToDisplayedArr(cardObj);
        }
        selectCards();
    }

    // function used to add 3 more cards when there is no set
    function addMoreCards() {
        // only does this when 3 or more cards exist
        if (model.getCardObjArr().length > 0) {
            let displayCardContainer =  view.getDisplayCardContainer();
            for (let i = 3; i > 0; i--) {
                let newCardContainer = document.createElement("div");
                $(newCardContainer).addClass("card-container");
                const randomIndex = Math.floor(Math.random() * (model.getCardObjArr()).length);
                const cardObj = (model.getCardObjArr())[randomIndex];
                model.removeFromCardObjArr(randomIndex);
                const card = document.createElement("img");
                card.src = cardObj.src;
                model.addCardObjToDisplayedArr(cardObj);
                $(newCardContainer).append(card);
                $(displayCardContainer).append(newCardContainer);
            }
            // adding new cards overflows the container; set the container scrollHeight to the bottom of the container
            if ((displayCardContainer)[0].scrollHeight > 0) {
                $(displayCardContainer).scrollTop((displayCardContainer)[0].scrollHeight);
            }
        }
        
    }

    //function used to add cards to data
    function selectCards() {
        $((".card-display-container")).on("click",".card-container",function() { 
            // remove hint class if the current clicked card is one of the hinted cards
            $(this).removeClass('hint')
            // get the index and use it to add/remove this card from data
            const clickedCardIndex = $(this).index();
            const selectedCardArr = model.getSelectedCardObjArr();
            // if the current clicked card exists in the selection, then remove it from the data;
            // else add the selected card to data if currently less than 3 cards are selected
            if (selectedCardArr.indexOf((model.getDisplayedCardArr())[clickedCardIndex]) >= 0) {
                $(this).removeClass("selected-card");
                const indexInSelectedCardArr = selectedCardArr.indexOf((model.getDisplayedCardArr())[clickedCardIndex]);
                model.removeFromSelectedCardArr(indexInSelectedCardArr);
            } else {
                if ((model.getSelectedCardObjArr()).length === 3) {
                    view.displayCardLimitPopup();
                } else {
                    $(this).addClass("selected-card");
                    model.addCardObjToSelectedCardArr((model.getDisplayedCardArr())[clickedCardIndex])
                }
            }
        });
    }

    // function used to evaluate whether selected cards form a valid set
    function evaluate(selectedCardArr) {
        let isValidSet = false;
        if (sameColor(selectedCardArr)) {
            if (differentFill(selectedCardArr) && differentNumber(selectedCardArr) && differentShape(selectedCardArr)) {
                isValidSet = true;
            }
        } else if (sameFill(selectedCardArr)) {
            if (differentColor(selectedCardArr) && differentNumber(selectedCardArr) && differentShape(selectedCardArr)) {
                isValidSet = true;
            }
        } else if (sameNumber(selectedCardArr)) {
            if (differentColor(selectedCardArr) && differentFill(selectedCardArr) && differentShape(selectedCardArr)) {
                isValidSet = true;
            }
        } else if (sameShape(selectedCardArr)) {
            if (differentColor(selectedCardArr) && differentFill(selectedCardArr) && differentNumber(selectedCardArr)) {
                isValidSet = true;
            }
        } else {
            if (differentColor(selectedCardArr) && differentFill(selectedCardArr) && differentNumber(selectedCardArr) && differentShape(selectedCardArr)) {
                isValidSet = true;
            }
        }
        return isValidSet;
    }

    // determine if selected cards have different colors
    function differentColor(selectedCardArr) {
        const firstCardObj = selectedCardArr[0];
        const secondCardObj = selectedCardArr[1];
        const thirdCardObj = selectedCardArr[2];
        let differentColor = false;
        if (firstCardObj.color !== secondCardObj.color && firstCardObj.color !== thirdCardObj.color && secondCardObj.color !== thirdCardObj.color) {
            differentColor = true;
        }
        return differentColor
    }

    // determine if selected cards have different fill style
    function differentFill(selectedCardArr) {
        const firstCardObj = selectedCardArr[0];
        const secondCardObj = selectedCardArr[1];
        const thirdCardObj = selectedCardArr[2];
        let differentFill = false;
        if (firstCardObj.fill !== secondCardObj.fill && firstCardObj.fill !== thirdCardObj.fill && secondCardObj.fill !== thirdCardObj.fill) {
            differentFill = true;
        }
        return differentFill;
    }

    // determine if selected cards have different numbers
    function differentNumber(selectedCardArr) {
        const firstCardObj = selectedCardArr[0];
        const secondCardObj = selectedCardArr[1];
        const thirdCardObj = selectedCardArr[2];
        let differentNumber = false;
        if (firstCardObj.number !== secondCardObj.number && firstCardObj.number !== thirdCardObj.number && secondCardObj.number !== thirdCardObj.number) {
            differentNumber = true;
        }
        return differentNumber;
    }

    // determine if selected cards have different shapes
    function differentShape(selectedCardArr) {
        const firstCardObj = selectedCardArr[0];
        const secondCardObj = selectedCardArr[1];
        const thirdCardObj = selectedCardArr[2];
        let differentShape = false;
        if (firstCardObj.shape !== secondCardObj.shape && firstCardObj.shape !== thirdCardObj.shape && secondCardObj.shape !== thirdCardObj.shape) {
            differentShape = true;
        }
        return differentShape;
    }

    // determine if selected cards have same colors
    function sameColor(selectedCardArr) {
        const firstCardObj = selectedCardArr[0];
        const secondCardObj = selectedCardArr[1];
        const thirdCardObj = selectedCardArr[2];
        let sameColor = false;
        if (firstCardObj.color === secondCardObj.color && firstCardObj.color === thirdCardObj.color && secondCardObj.color === thirdCardObj.color) {
            sameColor = true;
        }
        return sameColor;
    }

    // determine if selected cards same different number
    function sameNumber(selectedCardArr) {
        const firstCardObj = selectedCardArr[0];
        const secondCardObj = selectedCardArr[1];
        const thirdCardObj = selectedCardArr[2];
        let sameNumber = false;
        if (firstCardObj.number === secondCardObj.number && firstCardObj.number === thirdCardObj.number && secondCardObj.number === thirdCardObj.number) {
            sameNumber = true;
        }
        return sameNumber;
    }

    // determine if selected cards have same fill style
    function sameFill(selectedCardArr) {
        const firstCardObj = selectedCardArr[0];
        const secondCardObj = selectedCardArr[1];
        const thirdCardObj = selectedCardArr[2];
        let sameFill = false;
        if (firstCardObj.fill === secondCardObj.fill && firstCardObj.fill === thirdCardObj.fill && secondCardObj.fill === thirdCardObj.fill) {
            sameFill = true;
        }
        return sameFill;
    }

    // determine if selected cards same different shpae
    function sameShape(selectedCardArr) {
        const firstCardObj = selectedCardArr[0];
        const secondCardObj = selectedCardArr[1];
        const thirdCardObj = selectedCardArr[2];
        let sameShape = false;
        if (firstCardObj.shape === secondCardObj.shape && firstCardObj.shape === thirdCardObj.shape && secondCardObj.shape === thirdCardObj.shape) {
            sameShape = true;
        }
        return sameShape;
    }

    // generate a history of player1's sets
    function createPlayer1SetList(selectedCardArr) {
        // create an ul used for listing
        const ul = document.createElement("ul");
        $(ul).addClass("each-round-set-ul");
        const roundNumber = document.createElement("span");
        // creating li and adding class
        for (let i = 0; i < selectedCardArr.length; i++) {
            const li = document.createElement("li");
            $(li).addClass("each-round-set-li");
            const card = document.createElement("img");
            card.src = selectedCardArr[i].src;
            $(li).append(card);
            $(ul).append(li);
        }
        // append it to the beginning of the ul
        view.player1SetList.prepend(ul);
        $(roundNumber).html("Round: " + model.round);
        ul.prepend(roundNumber)
    }

    // same as creating list for player1
    function createPlayer2SetList(selectedCardArr) {
        const ul = document.createElement("ul");
        $(ul).addClass("each-round-set-ul");
        const roundNumber = document.createElement("span");
        for (let i = 0; i < selectedCardArr.length; i++) {
            const li = document.createElement("li");
            $(li).addClass("each-round-set-li");
            const card = document.createElement("img");
            card.src = selectedCardArr[i].src;
            $(li).append(card);
            $(ul).append(li);
        }
        view.player2SetList.prepend(ul);
        $(roundNumber).html("Round: " + model.round);
        ul.prepend(roundNumber);
    }

    return {
        setupBoard: setupBoard,
        evaluate: evaluate,
        addMoreCards: addMoreCards,
        createPlayer1SetList: createPlayer1SetList,
        createPlayer2SetList: createPlayer2SetList
    }

})()