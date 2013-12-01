BtcePair =
{
    btc_usd: 1,
    btc_rur: 17,
    btc_eur: 19,
    ltc_btc: 10,
    ltc_usd: 14,
    ltc_rur: 21,
    ltc_eur: 27,
    nmc_btc: 13,
    nmc_usd: 28,
    nvc_btc: 22,
    nvc_usd: 29,
    usd_rur: 18,
    eur_usd: 20,
    trc_btc: 23,
    ppc_btc: 24,
    ppc_usd: 31,
    ftc_btc: 25,
    xpm_btc: 30,
};

var BTCE =
{
    getTicker: function (pair, result)
    {
        $.getJSON("https://btc-e.com/api/2/" + pair + "/ticker", result);
    },

    getDepth: function(pair, result)
    {
        $.getJSON("https://btc-e.com/api/2/" + pair + "/depth", result);
    },

    getTrades: function(pair, result)
    {
        $.getJSON("https://btc-e.com/api/2/" + pair + "/trades", result);
    },

    getFees: function(method, price, pair, result)
    {
        $.ajax({
                type: "POST",
                url: "https://btc-e.com/ajax/order",
                data:
                {
                    calculate: method,
                    btc_count: 1,
                    btc_price: price,
                    pair: pair
                },
                success: function (data)
                {
                    result(data["fee"]);
                }
        });
    }
};

function BTCETrading(api_key, api_secret)
{
    nonce = Math.round((new Date()).getTime() / 1000);

    requestHelper = function (postArgs, result)
    {
        postArgs["nonce"] = nonce.toString();
        nonce++;
        var data = "";
        $.each(postArgs, function (key, value)
        {
            data += key + "=" + value + '&';
        });
        if (data.length > 0)
            data = data.substring(0, data.length - 1);
        var hash = CryptoJS.HmacSHA512(data, api_secret);
        $.ajax({
            url: "https://btc-e.com/tapi",
            type: 'post',
            data: postArgs,
            headers: {
                Key: api_key,
                Sign: hash.toString(CryptoJS.enc.Hex).toLowerCase()
            },
            success: result
        });
    }

    this.getInfo = function(result)
    {
        requestHelper({ "method": "getInfo" }, result);
    }
}
