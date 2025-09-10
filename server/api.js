const app=require('./index.js');
const serverless=require('serverless-http');

module.exports=(req,res)=>{
    const handler=serverless(app);
    return handler(req,res);
}