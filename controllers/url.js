const { nanoid } = require('nanoid');
const URL= require('../models/url')
async function handleGenerateShortURL(req, res){
    const body=req.body
    if(!body.url) return res.status(400).json({error:"URL is required"})
    const shortID= nanoid(7);
    await URL.create({
        shortId: shortID,
        redirectUrl: body.url,
        visitHistory:[],
    })
    const allUrls = await URL.find({});
    return res.render('home',{
        id: shortID,
        urls:allUrls,
    })
}

async function handleRedirectToMainUrl(req , res){
    const shortId=req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{ $push:{
        visitHistory: {timestamp:Date.now()}}
       }
    )
    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    res.redirect(entry.redirectUrl);
}

async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;
    const result=await URL.findOne({shortId});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports={handleGenerateShortURL , handleRedirectToMainUrl, handleGetAnalytics};