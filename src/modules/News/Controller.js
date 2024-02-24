/* eslint-disable no-underscore-dangle */
/* Package System */
require("module-alias/register");
const { fetchApi, genToken, changeToSlug } = require("@utils/Helper");
const Controller = require("@system/Controller");
const axios = require('axios');
const Model = require('@system/Model');
const _ = require('lodash');
/* Package Application */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const { formatEmail, extractBase64 } = require("@utils/Helper");

module.exports = class extends Controller {
  constructor(tableName) {
    super(tableName);
  }

  // ---------- GENERAL ----------//
  async create(req, res) {
    try {
        // Validate
        const _check = await this.validate(req, res);

        if (_check == false) {
            let _data = {};
            _data = req.body;
            _data.created_at = new Date();
            _data.updated_at = new Date();
            this.db.insert(_data);
            this.response(res, 200, _data);
        }
    } catch (e) {
        this.response(res, 500, e.message);
    }
} 
};
