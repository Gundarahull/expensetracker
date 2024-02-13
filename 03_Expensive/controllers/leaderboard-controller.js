const { where } = require("sequelize");
const Expensive = require("../model/expense-model");
const SignUp = require("../model/singup-model");
const data_exporter=require('json2csv').Parser


exports.leaderboard = (req, res) => {
    SignUp.findAll({
        attributes:['username','totalexpense'],
        order: [       ['totalexpense', 'DESC'] ]
    }).then(expenses=>{
        const viewdata = {
            expenses,
            pageTitle: "LEADERBOARD"
        };
        res.render('../views/premium/leaderboard', viewdata);
    })
    .catch(error => {
        console.error('Error occurred while fetching data:', error);
        res.status(500).send('Error occurred while fetching data');
    });
}

// const AWS = require('aws-sdk');

// function uploadToS3(data,filename){
//     const BUCKET_NAME='expensivetracker'
//     const IAM_KEY='AKIA47CRUZ4KMNB42BHS'
//     const SECRET_KEY= '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'  

//     //permmison
//     let s3bucket = new AWS.S3({
//         accessKeyId:IAM_KEY , 
//         secretAccessKey :SECRET_KEY, 
//         // Bucket:BUCKET_NAME 
//     })

//     s3bucket.createBucket(()=>{
//         var params={ 
//              Bucket: BUCKET_NAME,
//              Key: filename,
//             Body:data
//         }
//         s3bucket.upload(params,(err,data)=>{
//            if(!err){
//             console.log("UPLOADED");
//            }else{
//             console.log("ERROR IN UPLOAD");
//            }
//         })
//     })

  
//     var params = {Bucket:'expensetrackerbucket',  
//                  Key: filename ,  
//                  Body: JSON.stringify(data),  
//                  ContentEncoding: 'UTF8',  
//                  ContentType: 'application/json'};   
  
//     s3.upload(params, function(err, data) {    
//       if (!err) {
//         console.log('File uploaded successfully.');
//       } else {
//         console.error('Error uploading file:', err);
//       }
//     });
// }



const AWS = require('aws-sdk');

// exports.getbasis = async (req, res) => {
//     try {
//         const result = await SignUp.findOne({ where: { id: req.user.id } });
//         console.log("into the download Expenses");
//         if (result.ispremium === true) {
//             const data = await Expensive.findAll({ where: { signupId: req.user.id } });
//             console.log(data);
//             const stringy = JSON.stringify(data);
//             const filename = `Expense${req.user.id}/${new Date()}.txt`;
//             await uploadToS3(data, filename);
//             res.send('File uploaded successfully');
//         } else {
//             res.render('../views/premium/not_down');
//         }
//     } catch (err) {
//         console.log("error", err);
//         res.status(500).send('Error processing request');
//     }
// };

// async function uploadToS3(data, filename) {
//     // const AWS = require('aws-sdk');
//     const BUCKET_NAME = 'expensivetracker';
//     const IAM_KEY = 'AKIA47CRUZ4KMNB42BHS';
//     const SECRET_KEY = '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';
    
//     // Configure AWS
//     AWS.config.update({
//         accessKeyId: IAM_KEY,
//         secretAccessKey: SECRET_KEY
//     });

//     const s3 = new AWS.S3();

//     const params = {
//         Bucket: BUCKET_NAME,
//         Key: filename,
//         Body: JSON.stringify(data),
//         ContentType: 'application/json',
//         ACL: 'public-read' //auto download for the public
//     };

//     await s3.upload(params).promise();
//     console.log('File uploaded successfully.');
// }


exports.getbasis = (req, res) => {
    console.log("into the basis");
    SignUp.findOne({ where: { id: req.user.id } })
        .then(result => {
            console.log("into the download Expenses");
            if (result.ispremium === true) {
                Expensive.findAll({ where: { signupId: req.user.id } })
                    .then(data => {
                        console.log(data);
                        const stringy = JSON.stringify(data);
                        const filename = `Expense${req.user.id}/${new Date()}.txt`;
                        //sending and downloading the file
                        const onfilename = `Expense${req.user.id}/${new Date()}.csv`
                        const dataconv=JSON.parse(JSON.stringify(data))
                        var file_header=['amount','description','category']
                        var json_data=new data_exporter({file_header})
                        var csv_data=json_data.parse(dataconv)
                        res.setHeader("Content-Type","text/csv")
                        res.setHeader("Content-Disposition",`attachment;filename=${onfilename}`)
                        res.status(200).end(csv_data)
                        
                        //writing the function itself init
                       

                        function uploadToS3(data, filename) {
                            const BUCKET_NAME = 'expensivetracker';
                            const IAM_KEY = process.env.AWS_IAM_KEY
                            const SECRET_KEY =  process.env.AWS_SECRET_KEY;
                            // Configure AWS
                            AWS.config.update({
                                accessKeyId: IAM_KEY,
                                secretAccessKey: SECRET_KEY
                            });

                            const s3 = new AWS.S3();

                            const params = {
                                Bucket: BUCKET_NAME,
                                Key: filename,
                                Body: JSON.stringify(data),
                                ContentType: 'text/plain;charset=utf-8;',
                                ACL: 'public-read' //auto download for the public
                            };
                            s3.upload(params, function (err, data) {
                                if (!err) {
                                    console.log('File uploaded successfully.', data);
                                } else {
                                    console.error('Error uploading file:', err);
                                }
                            });
                        }
                        uploadToS3(data, filename);
                    }).catch(err => {
                        console.log("ERROR IN DOWNLOAD", err);
                    })
            } else {
                res.render('../views/premium/not_down')
            }
        }).catch(err => {
            console.log("error", err);
        })
}



















// totall adding the MONEY
       
//         using for of loop
//         Calculate total amount for each user
//         for (const item of expenses) {
//             const { username } = item.signup;
//             const { amount } = item;

//          If username doesn't exist in the object, initialize it with 0
//      Add the amount to the total for this user
    
//          Expensive.findAll({
//         attributes: ['amount'],
//         include:[{model:SignUp,
//             attributes:['username']
//         }]
//     })
//     .then(expenses => {
//         console.log(">>>>>>>> LEngth",expenses.length);
//         for (const item  of expenses) {
//             console.log(item.amount); 
//             console.log(item.signup.username);
//         }
//         const viewdata={
//             expenses,
//             pagetitl:"LEADER BOARD"
//         }
//         res.render('../views/premium/leaderboard',viewdata)
        
//     })
//     .catch(error => {
//         console.error('Error occurred while fetching data:', error);
//         res.status(500).send('Error occurred while fetching data');
//     });
  