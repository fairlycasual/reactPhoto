// put a component did mount in here to get the pictures in db on page load

// renderThumbInner function to render thumbnail from full image

// for image pathways reference the server? ie: src: localhost:8081/images/

// input should be an array of images:
/* 

  const images = [
    { original: urlOfFile,
      renderThumbInner: this.myRenderThumbInner
    },
    { original: urlOfFile,
      renderThumbInner: this.myRenderThumbInner    
    }
  ];

 // use url of rendered images on server -> loop through them and generate and object, then push to this array

  let images = [];
  fetch(localhost:8081/render, {
    method: get,
  }).then({
    // send back array of objects from server => images are rendered from byte there!!!
    res.json.then(body => {
      // can I do this w/o nested loops for performance?!?!
      body.foreach(object => {
        for (let key in object) {
          images.push({original: object[key], thumbnail: this,myRenderThumbInner});
        }
      })
    })
  })

*/