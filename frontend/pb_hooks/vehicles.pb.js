routerAdd("GET", "/api/dealers/{dealer}/vehicles", (e) => {
  let dealer = e.request.pathValue("dealer");

  let records = $app.findRecordsByFilter(
    "vehicles", // collection
    "dealer = {:dealer}", // filter
    "-created", // sort
    100, // limit
    0, // offset
    { "dealer": dealer }, // optional filter params
  );

  return e.json(200, { data: records });
});
