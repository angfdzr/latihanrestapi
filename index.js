const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;

// Set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create data
app.post("/api/latihanrestapi", (req, res) => {
  // Buat variabel penampung data dan query SQL
  const data = req.body; // Perbaiki penugasan data
  const querySql = "INSERT INTO latihanrestapi SET ?"; // Perbaiki penugasan querySql

  // Jalankan query
  db.query(querySql, data, (err, rows, fields) => {
    // Perbaiki penulisan fields
    // Error handling
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal insert data!", error: err }); // Perbaiki penulisan JSON
    }

    // Jika request berhasil
    return res
      .status(200)
      .json({ message: "Data berhasil disimpan!", data: rows }); // Tambahkan respons sukses
  });
});

app.get("/api/latihanrestapi", (req, res) => {
  const querySql = "SELECT * FROM latihanrestapi";
  db.query(querySql, (err, rows, field) => {
    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }
    // jika request berhasil
    res.status(200).json({ success: true, data: rows });
  });
});

app.put("/api/latihanrestapi/:id", (req, res) => {
  const data = { ...req.body };
  const querySearch = "SELECT * FROM latihanrestapi WHERE id = ?";
  const queryUpdate = "UPDATE latihanrestapi SET ? WHERE id = ?";

  db.query(querySearch, req.params.id, (err, rows, field) => {
    // error handling
    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }
    // jika id yang dimasukkan sesuai dengan data yang ada di db
    if (rows.length) {
      // jalankan query update
      db.query(queryUpdate, [data, req.params.id], (err, rows, field) => {
        // error handling
        if (err) {
          return res.status(500).json({ message: "Ada kesalahan", error: err });
        }
        // jika update berhasil
        res
          .status(200)
          .json({ success: true, message: "Berhasil update data!" });
      });
    } else {
      return res
        .status(404)
        .json({ message: "Data tidak ditemukan!", success: false });
    }
  });
});

// delete data
app.delete("/api/latihanrestapi/:id", (req, res) => {
  // buat query sql untuk mencari data dan hapus
  const querySearch = "SELECT * FROM latihanrestapi WHERE id = ?";
  const queryDelete = "DELETE FROM latihanrestapi WHERE id = ?";
  // jalankan query untuk melakukan pencarian data
  db.query(querySearch, req.params.id, (err, rows, field) => {
    // error handling
    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }
    // jika id yang dimasukkan sesuai dengan data yang ada di db
    if (rows.length) {
      // jalankan query delete
      db.query(queryDelete, req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
          return res.status(500).json({ message: "Ada kesalahan", error: err });
        }
        // jika delete berhasil
        res
          .status(200)
          .json({ success: true, message: "Berhasil hapus data!" });
      });
    } else {
      return res
        .status(404)
        .json({ message: "Data tidak ditemukan!", success: false });
    }
  });
});

// Buat server
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
