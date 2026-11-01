const _k = "b3Blbi1zZXNhbWUtMjAyNg==";
const _v = "ZmxhZ3tuZXZlcl90cnVzdF90aGVfY2xpZW50fQ==";
document.getElementById("b").addEventListener("click", function () {
  var out = document.getElementById("o");
  if (document.getElementById("p").value === atob(_k)) { out.textContent = atob(_v); }
  else { out.textContent = "Access denied."; }
});
