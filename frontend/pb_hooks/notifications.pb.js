routerAdd("GET", "/api/dealers/{dealer}/notifications", (e) => {
  let dealer = e.request.pathValue("dealer");

  let records = $app.findRecordsByFilter(
    "notifications",
    "dealer = {:dealer}",
    "-created",
    100,
    0,
    { "dealer": dealer },
  );

  return e.json(200, { data: records });
});
