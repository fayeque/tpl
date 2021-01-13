


var S_CACHE="version2";
var CACHE_DYN="d_version2";
self.addEventListener("install",(event) => {
    console.log("Installing ...",event);
    event.waitUntil(
        caches.open(S_CACHE)
        .then((cache) => {
            console.log("caching the landing");
            cache.addAll([
                "/",
                "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css",
                "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
                "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js",
                "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/fonts/glyphicons-halflings-regular.woff2",
                "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/fonts/glyphicons-halflings-regular.woff",
                "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/fonts/glyphicons-halflings-regular.ttf"

                
            ]);
        })
        )
});

self.addEventListener("activate",(event) => {
    event.waitUntil(
        caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(key !== S_CACHE && key != CACHE_DYN){
                    return caches.delete(key);
                }
            }))
        })
    )
})

self.addEventListener("fetch",(event) => {
    event.respondWith(
        fetch(event.request)
        .then(function(res){
            return caches.open(CACHE_DYN)
            .then((cache) => {
                cache.put(event.request.url,res.clone());
                return res;
            })
        }).catch((err) => {
            return caches.match(event.request)
        })
    )
})

// self.addEventListener("fetch",(event) => {
//     // console.log("fetch event",event);
//     if (event.request.clone().method === 'GET'){
//     event.respondWith(caches.match(event.request)
//     .then((response) => {
//         if(response){
//             return response;
//         }else{
//             console.log("fetch is fired");

//             return fetch(event.request)
//             .then((res) => {
//                 console.log("fetch response",res);
//                 caches.open(CACHE_DYN)
//                 .then((cache) => {
//                     cache.put(event.request.url,res.clone());
//                     console.log("event request",event.request);
//                     return res;
//                 })
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//         }
//     }))
// }else{
//     // attempt to send request normally
//     event.respondWith(fetch(event.request.clone()).catch(function
//     (error) {
//       // only save post requests in browser, if an error occurs
//       savePostRequests(event.request.clone().url, form_data)
//     }))
//   }
// })