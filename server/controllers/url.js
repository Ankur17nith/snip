const { nanoid } = require('nanoid');
const url = require('../models/url');
const geoip = require("geoip-lite");

async function handleGenerateShortUrl(req, res){
    const body= req.body;
    if(!body.url) return res.status(400).json({error:"URL is required"});
    const shortid=nanoid(7);

    await url.create({
        shortId: shortid,
        originalUrl: body.url,
        userId: req.user?._id,
        clicks: 0,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days

    })
    return res.json({shortId: shortid,})
}

async function handleReturnAllUrl(req, res){
    const user=req.user._id;
    const urls= await url.find({userId: user});
    return res.status(200).json(urls);
}

async function handleDeleteUrl(req, res) {
    try {
        const { shortId } = req.params;
        const userId = req.user._id;

        const deletedUrl = await url.findOneAndDelete({
            shortId,
            userId,
        });

        if (!deletedUrl) {
            return res.status(404).json({
                message: "URL not found",
            });
        }

        return res.status(200).json({
            message: "URL deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

async function handleRedirectUrl(req, res){
    try {
        const {shortId} = req.params;
        const Url = await url.findOne({ shortId });
        const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress ||
        req.ip;

        const geo = geoip.lookup(ip);

        // find url
        if (!Url) {
            return res.status(404).json({
                message: "Short URL not found",
            });
        }

        //check expiry
        if(Url.expiresAt< new Date()){
            return res.status(410).json({
                message: "This short URL has expired",
            })
        }

        //increment
         await url.findOneAndUpdate(
            { shortId },
            { 
             $inc: { clicks: 1 },
             $push: {
                clickHistory: {
                    timestamp: new Date(),
                    country: geo?.country || "Unknown",
                    city: geo?.city || "Unknown",
                },
            },
            },
            
        );

        

        return res.redirect(Url.originalUrl);
        

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const { shortId } = req.params;
        const userId = req.user._id;

        // Find URL belonging to the logged-in user
        const url = await Url.findOne({
            shortId,
            userId,
        });

        if (!url) {
            return res.status(404).json({
                message: "URL not found",
            });
        }

        // Calculate top countries
        const countryCount = {};

        url.clickHistory.forEach((click) => {
            const country = click.country || "Unknown";

            countryCount[country] =
                (countryCount[country] || 0) + 1;
        });

        const topCountries = Object.entries(countryCount)
            .sort((a, b) => b[1] - a[1])
            .map(([country, clicks]) => ({
                country,
                clicks,
            }));

        return res.status(200).json({
            totalClicks: url.clicks,
            clickHistory: url.clickHistory,
            topCountries,
            createdAt: url.createdAt,
            expiresAt: url.expiresAt,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}



module.exports = { handleGenerateShortUrl,
    handleReturnAllUrl,
    handleDeleteUrl,
    handleRedirectUrl,
    handleUrlAnalytics
};