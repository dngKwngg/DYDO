const connection = require("../config/connection");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    console.log(req.body);

    connection.query(
        "SELECT * FROM user WHERE email = ?",
        req.body.email,
        (err, result, fields) => {
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: err,
                });
            } else if (!result.length) {
                return res.status(401).json({
                    status: "Failed",
                    message: "Email not found",
                });
            } else {
                console.log(result[0]);
                bcrypt.compare(
                    req.body.password,
                    result[0].password,
                    (err, isMatch) => {
                        if (err) {
                            return res.status(500).json({
                                status: "Failed",
                                message: err,
                            });
                        } else if (!isMatch) {
                            return res.status(401).json({
                                status: "Failed",
                                message: "Password is incorrect",
                            });
                        } else {
                            return res.status(200).json({
                                status: "Success",
                                message: "Login successful",
                                data: result[0],
                            });
                        }
                    }
                );
            }
        }
    );
};
