const test = (req, res) => {
    res.status(200).json({ message: "Hola desde msauth" });
  };
  
module.exports = { test };
  