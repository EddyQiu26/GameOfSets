// create a promise to preload all the card images
const promise = new Promise((resolve) => {
    const shape = ["diamond" , "round", "sq"];
    const fill = ["shaded", "stripe", "plain"];
    const color = ["red" , "purple", "green"];
    // 3 loops to creat image src
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < fill.length; j++){
            for(let k = 0; k < color.length; k++){
                for(let c = 1; c < 4; c++){
                    const cardObj = {
                        shape : shape[i],
                        fill : fill[j],
                        color : color[k],
                        number : c,
                        src : "./img/" + shape[i] + "-" + color[k] + "-" + fill[j] + (c) + ".png"
                    }
                    // add each image to array in model obj
                    model.addCardObj(cardObj);
                }
            }
        }
    }
    // shuffle the array with 81 cards to create randomness for later purpose
    model.shuffleArray();
    // once all images are preloaded, resolve promise
    resolve();
})

// since promise is resolved, call then()
promise.then(() => {
    // start the game
    view.getReady();
})
