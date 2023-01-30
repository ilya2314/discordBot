// Load realms list
const realms = require('./realms.json');

// Load modules
const fetch = require('axios'),
    cheerio = require("cheerio");
const tabletojson = require("tabletojson").Tabletojson;
const { JSDOM } = require("jsdom");;

class Wargamer {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async get(url) {
        let res = await fetch(url);
        let json = await res.json();
        return json.data;
    }

    /**
     * Find a player and returns his ID and his nickname
     * @param {object} options
     * @param {string} options.realm The realm server of the player
     * @param {string} options.search The search string
     * @returns {Promise<object>}
     */
    async findPlayer(options) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            const realmData = (options ? realms.find((r) => r.name === options.realm || r.aliases.includes(options.realm)) : realms[0]);
            let data = await _this.get(`${realmData.baseURL}/wot/account/list/?search=${options.search}&application_id=${_this.apiKey}`);
            if (!data || !data[0]) return reject("Player not found");
            resolve({ realm: realmData.name, ID: data[0].account_id, nickname: data[0].nickname });
        });
    }

    /**
     * Get players stats
     * @param {object} options
     * @param {string} options.realm The realm server of the player
     * @param {string} options.ID The id of the player to fetch
     * @param {boolean} fetchWN8 Whether to fetch WN8 score
     * @param {boolean} fetchTanks Whether to fetch tanks infos
     * @returns {Promise<object>}
     */
    async getPlayerStats(options, fetchWN8, fetchTanks) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            const realmData = (options ? realms.find((r) => r.name === options.realm || r.aliases.includes(options.realm)) : realms[0]);
            let playerData = await _this.get(`${realmData.baseURL}/wot/account/info/?account_id=${options.ID}&application_id=${_this.apiKey}`);
            playerData = playerData[options.ID];
            if (playerData.clan_id) {
                let clanData = await _this.get(`${realmData.baseURL}/wot/stronghold/claninfo/?clan_id=${playerData.clan_id}&application_id=${_this.apiKey}`);
                playerData.clan = clanData[playerData.clan_id];
            }
            if (fetchWN8) {
                playerData.wn8 = await _this.getPlayerWn8({ realm: realmData.name, ID: options.ID, nickname: playerData.nickname });
            }
            if (fetchTanks) {
                playerData.tanks = await _this.getPlayerTanks.call(_this, { realm: realmData.name, ID: options.ID });
            }
            resolve({ ...playerData, ...{ realmData } });
        });
    }

    /**
     * Get a player WN8
     * @param {object} options
     * @param {string} options.realm The realm server of the player
     * @param {string} options.ID The id of the player to fetch
     * @param {string} options.nickname The nickname of the player to fetch
     * @returns {Promise<object>}
     */
    async getPlayerWn8(options) {
        return new Promise(async function (resolve, reject) {
            const realmData = (options ? realms.find((r) => r.name === options.realm || r.aliases.includes(options.realm)) : realms[0]);
            let stats;
            if (realmData.name === "eu" || realmData.name === "na" || realmData.name === "ru") {
                const json = await tabletojson.convertUrl(`https://wot-life.com/${realmData.name}/player/${options.nickname}/${options.ID}`);
                if (!json[0]) return resolve({
                    now: 0,
                    "24h": 0,
                    "7d": 0,
                    "30d": 0,
                    color: "#000000"
                });
                stats = {
                    now: parseInt(json[0][json[0].length - 1].WN8, 10),
                    "24h": parseInt(json[0][json[0].length - 1]["Past 24 hours"], 10),
                    "7d": parseInt(json[0][json[0].length - 1]["Past 7 days"], 10),
                    "30d": parseInt(json[0][json[0].length - 1]["Past 30 days"], 10)
                };
            } else {
                const res = await fetch(`https://wotlabs.net/${realmData.wotLabs}/player/${options.nickname}`);
                const html = await res.text();
                const $ = cheerio.load(html);
                stats = {
                    now: parseInt($(".wnrow").get(0).children[1].children[0].data) || 0,
                    "24h": parseInt($(".wnrow").get(0).children[2].children[0].data) || 0,
                    "7d": parseInt($(".wnrow").get(0).children[3].children[0].data) || 0,
                    "30d": parseInt($(".wnrow").get(0).children[4].children[0].data) || 0,
                    color: "#000000"
                };
            }
            if (stats.now > 300 && stats.now < 599) stats.color = "#cd3333";
            else if (stats.now > 600 && stats.now < 899) stats.color = "#d77900";
            else if (stats.now > 900 && stats.now < 1249) stats.color = "#d7b600";
            else if (stats.now > 1250 && stats.now < 1599) stats.color = "#6d9521";
            else if (stats.now > 1600 && stats.now < 1899) stats.color = "#4c762e";
            else if (stats.now > 1900 && stats.now < 2349) stats.color = "#4a92b7";
            else if (stats.now > 2350 && stats.now < 2899) stats.color = "#83579d";
            else if (stats.now > 2899) stats.color = "#5a3175";
            resolve(stats);
        });
    }

    /**
     * Find a clan and returns his ID and his name
     * @param {object} options
     * @param {string} options.realm The realm server of the clan
     * @param {string} options.search The search string
     * @returns {Promise<object>}
     */
    async findClan(options) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            const realmData = (options ? realms.find((r) => r.name === options.realm || r.aliases.includes(options.realm)) : realms[0]);
            let data = await _this.get(`${realmData.baseURL}/wgn/clans/list/?search=${options.search}&application_id=${_this.apiKey}`);
            if (!data[0]) return reject("Clan not found");
            resolve({ realm: realmData.name, ID: data[0].clan_id, name: data[0].name });
        });
    }

    /**
     * Get clan stats
     * @param {object} options
     * @param {string} options.realm The realm of the clan to fetch
     * @param {string} options.ID the id of the clan to fetch
     * @returns {Promise<object>}
     */
    async getClanStats(options) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            const realmData = (options ? realms.find((r) => r.name === options.realm || r.aliases.includes(options.realm)) : realms[0]);
            let clanInfos = await _this.get(`${realmData.baseURL}/wgn/clans/info/?clan_id=${options.ID}&application_id=${_this.apiKey}`);
            clanInfos = clanInfos[options.ID];
            let clanStats = await _this.get(`${realmData.baseURL}/wot/stronghold/claninfo/?clan_id=${options.ID}&application_id=${_this.apiKey}`);
            clanStats = clanStats[options.ID];
            let clanWn8 = await _this.getClanWn8({ realm: realmData.name, ID: clanInfos.clan_id, tag: clanInfos.tag });
            resolve({ ...clanInfos, ...clanStats, ...{ wn8: clanWn8 }, ...{ realmData } });
        });
    }

    /**
     * Get a clan WN8
     * @param {object} options
     * @param {string} options.realm The realm server of the clan
     * @param {string} options.ID The id of the clan to fetch
     * @param {string} options.tag The tag of the clan to fetch
     * @returns {Promise<object>}
     */
    async getClanWn8(options) {
        return new Promise(async function (resolve, reject) {
            const realmData = (options ? realms.find((r) => r.name === options.realm || r.aliases.includes(options.realm)) : realms[0]);
            let stats;
            if (realmData.name === "eu" || realmData.name === "na") {
                let json = await tabletojson.convertUrl(`https://wot-life.com/${realmData.name}/clan/${options.tag}-${options.ID}`);
                stats = {
                    now: parseInt(json[0][1].Total, 10),
                    color: "#000000"
                };
            } else {
                const res = await fetch(`https://wotlabs.net/${realmData.wotLabs}/clan/${options.tag}`);
                const html = await res.text();
                stats = {
                    now: parseInt(new JSDOM(html).window.document.querySelector(".boxStats.boxWn.dgreen").childNodes[2].textContent.trim()) || 0,
                    color: "#000000"
                };
            }
            if (stats.now > 300 && stats.now < 599) stats["color"] = "#cd3333";
            else if (stats.now > 600 && stats.now < 899) stats["color"] = "#d77900";
            else if (stats.now > 900 && stats.now < 1249) stats["color"] = "#d7b600";
            else if (stats.now > 1250 && stats.now < 1599) stats["color"] = "#6d9521";
            else if (stats.now > 1600 && stats.now < 1899) stats["color"] = "#4c762e";
            else if (stats.now > 1900 && stats.now < 2349) stats["color"] = "#4a92b7";
            else if (stats.now > 2350 && stats.now < 2899) stats["color"] = "#83579d";
            else if (stats.now > 2899) stats["color"] = "#5a3175";
            resolve(stats);
        });
    }

    /**
     * Gets the tanks of a player
     * @param {object} options
     * @param {string} options.realm The realm of the player
     * @param {string} options.ID The ID of the player
     * @returns {Promise<Array>}
     */
    async getPlayerTanks(options) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            const realmData = (options ? realms.find((r) => r.name === options.realm || r.aliases.includes(options.realm)) : realms[0]);
            let tanks = await _this.get(`${realmData.baseURL}/wot/account/tanks/?account_id=${options.ID}&application_id=${_this.apiKey}`);
            tanks = tanks[options.ID];
            let tanksList = await _this._getTanksInfos.call(_this, tanks, realmData.baseURL);
            resolve(tanksList);
        });
    }

    /**
     * For each tank, resolve information
     * @param {array} tanks The tanks to fetch
     * @returns {Promise<Array>}
     */
    async _getTanksInfos(tanks, baseURL) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            const tanksInfos = [];
            let i = 0;
            let interval = setInterval(getInfos, 51, tanks);
            async function getInfos(tanks) {
                i++;
                if (!tanks[i]) {
                    clearInterval(interval);
                    return resolve(tanksInfos);
                }
                let t = tanks[i];
                let infos = await _this.get(`${baseURL}/wot/encyclopedia/vehicles/?application_id=${_this.apiKey}&tank_id=${t.tank_id}`);
                tanksInfos.push({ ...infos[t.tank_id], ...t });
            }

        });
    }

};

module.exports = Wargamer;