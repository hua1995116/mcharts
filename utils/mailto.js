const nodemailer = require('nodemailer');
const debounce = require('./index.js').debounce;

function mailtoer(data) {
    const auth = {
        user : '',  // 配置账户
        pass : ''   // 配置密码
    }
    if(!auth.user && !auth.pass) {
        return;
    }
    let mailOptions = {
        from: '秋风<461249104@qq.com>', // sender address
        to: 'qiufenghyf@163.com', // list of receivers
        subject: '前端监控异常信息', // Subject line
        text: data, // plain text body
        html: data // html body
    };
    nodemailer.createTestAccount((err, account) => {
        var mailTransport = nodemailer.createTransport({
            host : 'smtp.qq.com',
            port: '587',
            secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
            auth : auth,
        });
        
        // send mail with defined transport object
        mailTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
        });
    })  
}

module.exports = mailtoer;
  

