const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")

const app = express()

const port = 8000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const checkPin = (req) => {
  let {
    query: { id },
    headers: { authorization },
  } = req

  // ! For protect info.txt file
  if (authorization && !id?.includes("info")) {
    return authorization == 1527
  } else {
    return false
  }
}

const getFiles = (req, res) => {
  if (checkPin(req)) {
    fs.readdir(`data`, (err, data) => {
      if (err) {
        res.send(`File does not exist!`, 404)
      } else {
        let fileList = []
        data.forEach((file) => fileList.push(file))

        res.send(`File list: ${fileList.join(" - ")}`, 200)
      }
    })
  } else {
    res.send(`Key is not currect!`, 401)
  }
}

const getTargetFile = (req, res) => {
  if (checkPin(req)) {
    const {
      query: { id },
    } = req

    if (id) {
      fs.readFile(`data/${id}.json`, (err, data) => {
        if (err) {
          res.send(`File does not exist! ${id}.json`, 404)
        } else {
          res.send(`File info: ${data}`, 200)
        }
      })
    } else {
      res.send(`Send me param!`, 500)
    }
  } else {
    res.send(`Key is not currect!`, 401)
  }
}

const createFile = (req, res) => {
  if (checkPin(req)) {
    const {
      body,
      query: { id },
    } = req

    let path = `data/${id || Math.ceil(Math.random() * 99999)}.json`

    fs.appendFile(path, JSON.stringify(body), function (err) {
      if (err) {
        res.send(`We have error: ${err}`, 500)
      } else {
        res.send(`Your detailes saved. URL: /${path}`, 200)
      }
    })
  } else {
    res.send(`Key is not currect!`, 401)
  }
}

const editFile = (req, res) => {
  if (checkPin(req)) {
    const {
      body,
      query: { id },
    } = req

    if (id) {
      const path = `data/${id}.json`

      fs.readFile(path, (err, data) => {
        if (err) {
          res.send(`File does not exist! ${id}.json`, 404)
        } else {
          fs.writeFile(path, JSON.stringify(body), function (err) {
            if (err) {
              res.send(`We have error: ${err}`, 500)
            } else {
              res.send(`Your detailes updated. URL: /${path}`, 200)
            }
          })
        }
      })
    } else {
      res.send(`Yo do not want anything! search and edit a file!`, 500)
    }
  } else {
    res.send(`Key is not currect!`, 401)
  }
}

const deleteFile = (req, res) => {
  if (checkPin(req)) {
    const {
      body,
      query: { id },
    } = req

    if (id) {
      const path = `data/${id}.json`

      fs.unlink(path, function (err) {
        if (err) {
          res.send(`We have error: ${err}`, 500)
        } else {
          res.send(`Your detailes deleted. URL: /${path}`, 200)
        }
      })
    } else {
      res.send(`Yo do not want anything! search and delete a file!`, 500)
    }
  } else {
    res.send(`Key is not currect!`, 401)
  }
}

const addText = (req, res) => {
  const {
    body,
    query: { id },
  } = req

  let name = id || Math.ceil(Math.random() * 99999)

  const path = `data/info.txt`

  if (checkPin(req)) {
    const newText = `\n${name}: ${JSON.stringify(body)}\n`

    fs.readFile(path, (err, data) => {
      if (err) {
        res.send(`We have error: ${err}`, 500)
      } else {
        fs.appendFile(path, newText, function (err) {
          if (err) {
            res.send(`We have error: ${err}`, 500)
          } else {
            res.send(`Your detailes inserted.`, 200)
          }
        })
      }
    })
  } else {
    res.send(`Key is not currect!`, 401)
  }
}

const deleteAllText = (req, res) => {
  if (checkPin(req)) {
    const {
      body,
      query: { id },
    } = req

    const path = `data/info.txt`

    fs.readFile(path, (err, data) => {
      if (err) {
        res.send(`We have error: ${err}`, 404)
      } else {
        fs.writeFile(path, "", function (err) {
          if (err) {
            res.send(`We have error: ${err}`, 500)
          } else {
            res.send(`Your detailes deleted.`, 200)
          }
        })
      }
    })
  } else {
    res.send(`Key is not currect!`, 401)
  }
}

app.get("/file/get-all", getFiles)
app.get("/file/get", getTargetFile)
app.post("/file/add", createFile)
app.put("/file/edit", editFile)
app.delete("/file/delete", deleteFile)

app.post("/text/add", addText)
app.delete("/text/delete-all", deleteAllText)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
