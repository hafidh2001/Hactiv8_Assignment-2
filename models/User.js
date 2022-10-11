import { hash, compare } from "../helpers/bcrypt.js";
import * as fs from "fs";
import { pathJSON } from "../config.js";

export const storeUser = async (email, password) => {
  try {
    if (email == null || password == null)
      return { status: "error", message: "email & password are required" };

    const encrypt_password = await hash(password);
    const data = {
      id: +new Date(),
      email: email,
      password: encrypt_password,
      createdAt: new Date(),
    };
    // read data, then convert data to JSON
    const convert_toJSON = JSON.parse(fs.readFileSync(pathJSON, "utf8"));
    // spread data
    const spread_data = [...convert_toJSON, data];
    // convert data to STRING, then write data
    fs.writeFileSync(pathJSON, JSON.stringify(spread_data), "utf8");
    // create response from data.json
    const res = JSON.parse(fs.readFileSync(pathJSON, "utf8")).filter(
      (item) => item.email === email
    )[0];
    delete res.password;
    return { status: "success", res };
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

export const checkUser = async (email, password) => {
  try {
    if (email == null || password == null)
      return { status: "error", message: "email & password are required" };

    const convert_toJSON = JSON.parse(fs.readFileSync(pathJSON, "utf8"));
    const data = convert_toJSON.filter((item) => item.email === email);
    if (data.length === 0)
      return { status: "error", message: "email does not exist" };

    const res = data[0];
    if (!(await compare(password, res.password))) {
      return { status: "error", message: "password does not match" };
    } else {
      delete res.password;
      return { status: "success", res };
    }
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

export const getAll = async () => {
  try {
    const convert_toJSON = JSON.parse(fs.readFileSync(pathJSON, "utf8"));
    const res = convert_toJSON.filter((item) => delete item.password);
    return { status: "success", res };
  } catch (error) {
    return { status: "error", message: error.message };
  }
};
