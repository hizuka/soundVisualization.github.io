/**
 * 遍历指定目录下的所有文件
 * @param {*} dir
 */

const fs=require('fs');
const path=require('path');


// const getAllFile=function(dir){
//     let res=[]
//     function traverse(dir){
//         fs.readdirSync(dir).forEach((file)=>{
//             const pathname=path.join(dir,file)
//             if(fs.statSync(pathname).isDirectory()){
//                 traverse(pathname)
//             }else{
//                 res.push(pathname)
//             }
//         })
//     }
//     traverse(dir)
//     return res;
// }

const getAllFile=function(){
    let res=[]
    function traverse(){
        fs.readdirSync("https://github.com/hizuka/HeartSound").forEach((file)=>{
            const pathname=path.join("./original",file)
            if(fs.statSync(pathname).isDirectory()){
                console.log("err:","Directory not supported")
            }else{
                res.push(pathname)
            }
        })
    }
    traverse()
    return res;
}

// editDependencies({key:"axios",value:"^0.18.0",filepath:'./package.json'})
const res=getAllFile()
console.log("begin:")
for (let i = 0; i < res.length; i++) {
                    console.log(res[i])
                }
module.exports = getAllFile;



