import http from 'http';
const post=(body,sid)=>new Promise((res,rej)=>{const r=http.request({host:'127.0.0.1',port:3845,path:'/mcp',method:'POST',headers:{'content-type':'application/json',accept:'application/json, text/event-stream',...(sid?{'mcp-session-id':sid}:{})}},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res({sid:x.headers['mcp-session-id'],d}))});r.on('error',rej);r.end(JSON.stringify(body))});
const a=await post({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'a',version:'1'}}});
await post({jsonrpc:'2.0',method:'notifications/initialized'},a.sid);
const b=await post({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'get_metadata',arguments:{nodeId:process.argv[2]}}},a.sid);
console.log(b.d.slice(0,600));
