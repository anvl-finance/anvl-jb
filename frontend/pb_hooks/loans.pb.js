routerAdd("GET", "/api/dealers/{dealer}/loans", (e) => {
  let dealer = e.request.pathValue("dealer");

  let records = $app.findRecordsByFilter(
    "loans",
    "dealer = {:dealer}",
    "-created",
    100,
    0,
    { "dealer": dealer },
  );

  return e.json(200, { data: records });
});
