import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import transporter from "../config/nodemailer.js";

// USER SIGNUP CONTROLLER FUNCTION 
export const register = async(req,res)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({success:false , message : "Missing details"})
    }

    try{

        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.json({success:false , message:"User already exists"});
        }

        const hashedPassword = await bcrpyt.hash(password,10);
        const user = new userModel({name,email,password : hashedPassword });
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET , { expiresIn:'7d'});

        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //Sending welcome email
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to: email,
            subject: "🎉 Welcome to StudySync – Let’s Achieve Your Goals Together!",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #4CAF50;">Welcome to StudySync, ${name}!</h2>
              <p>Hi ${name},</p>
              <p>We’re thrilled to have you join the StudySync community! 🚀</p>
              <p>StudySync is your go-to platform for staying organized, managing your studies, and achieving your academic and personal goals. Here’s what you can do next:</p>
              <ul>
                <li><strong>Get Started Quickly:</strong> Explore your personalized dashboard.</li>
                <li><strong>Track Your Progress:</strong> Monitor your study habits and stress levels.</li>
                <li><strong>Reach Your Full Potential:</strong> Access our tailored tools to stay on top of your game.</li>
              </ul> 
              <p>If you ever need help or have questions, our support team is here for you. You can reach us anytime at <a href="mailto:support@studysync.com">support@studysync.com</a>.</p>
              <p>Let’s make your learning journey smooth and rewarding.</p>
              <p>Best wishes,<br>The StudySync Team</p>
            </div>
          `,
        }

        await transporter.sendMail(mailOptions);
        


        return res.json({success:true});
    }
    catch(error) {
       return res.json({success:false , message : error.message})
    }
} 

// LOGIN USER

export const login =async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password) {
        return res.json({success:false , message:"Email and Password are required"})
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false , message:"Invalid Email"})
        } 
        const isMatch = await bcrpyt.compare(password, user.password);
        if(!isMatch){
            return res.json({success:false , message:"Invalid Password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET , { expiresIn:'7d'});

        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success:true});

    } catch (error) {
       return res.json({success:false , message:error.message})
    }
}

// LOGOUT USER

export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV === 'production'? 'none' : 'strict',
        })
        return res.json({success:true, message:"Logged Out"});
    } catch (error) {
       return res.json({success:false , message:error.message})
    }
}

// Send verification otp
export const sendVerifyOtp = async (req,res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false , message:"Account already verified"})
        }

      const otp =  String(Math.floor(100000 + Math.random() * 900000));

      user.verifyOtp = otp;
      user.verifyOtpExpireAt= Date.now() + 24*60*60*1000;

      await user.save();

      const mailOptions = {
        from: process.env.SENDER_EMAIL, // Sender address
        to: user.email, // Recipient's email address
        subject: '🔐 Verify Your Email for StudySync',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
            <h2 style="color: #4CAF50;">Email Verification Code</h2>
            <p>Hi ${user.name},</p>
            <p>Thank you for registering with StudySync! To complete your sign-up, please use the verification code below:</p>
            <div style="margin: 20px auto; padding: 10px; border: 1px solid #4CAF50; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes, so please verify your email soon.</p>
            <p>If you didn’t request this, please ignore this email or contact us at <a href="mailto:support@studysync.com">support@studysync.com</a>.</p>
            <p>Best wishes,<br>The StudySync Team</p>
          </div>
        `,
      }
      await transporter.sendMail(mailOptions)

     return res.json({success:true , message:"Verification otp sent on email"});
      

    } catch (error) {
       return res.json({success:false , message:error.message})
    }
}

//Verification of email

export const verifyEmail = async(req,res) =>{
    const {userId, otp} = req.body;
    if(!userId || !otp) {
       return res.json({success:false , message:"Missing details"})
    }
    try {

        const user = await userModel.findById(userId);
        if(!user ){
           return res.json({success:false , message:"User Not Found"})
        }
        
        if(user.verifyOtp === '' || user.verifyOtp!== otp){
            return res.json({success:false , message:"Invalid Otp"})
        }

        if(user.verifyOtpExpireAt < Date.now() ){
            return res.json({success:false , message:"Otp expired"})
        }

        user.isAccountVerified=true;
        user.verifyOtp=''
        user.verifyOtpExpireAt=0;

        await user.save();
        return res.json({success:true , message:"Email Verified Successfully!"})
    } catch (error) {
       return res.json({success:false , message:error.message})
    }

    
}

//check if user is authenticated

export const isAuthenticated = async(req,res)=>{
    try {
        return res.json({success:true});
    } catch (error) {
        res.json({success:false, message: error.message});
    }
}

//Send password Reset OTP
export const sendResetOtp = async(req,res)=>{
    const {email}= req.body;
    if(!email) {
        return res.json({success:false, message:"Email is required"})
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
           return res.json({success:false, message: "User not found"});
        }

        const otp =  String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt= Date.now() + 15*60*1000;
  
        await user.save();
  
        const mailOptions = {
          from: process.env.SENDER_EMAIL, // Sender address
          to: user.email, // Recipient's email address
          subject: '🔐 Reset Your Password – StudySync',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
              <h2 style="color: #4CAF50;">Password Reset Code</h2>
              <p>Hi ${user.name},</p>
              <p>You recently requested to reset your password for your StudySync account. Use the verification code below to proceed:</p>
              <div style="margin: 20px auto; padding: 10px; border: 1px solid #4CAF50; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50;">
                ${otp}
              </div>
              <p>This code will expire in 15 minutes. If you did not request a password reset, please ignore this email or contact us at <a href="mailto:support@studysync.com">support@studysync.com</a>.</p>
              <p>For your security, please do not share this code with anyone.</p>
              <p>Best regards,<br>The StudySync Team</p>
            </div>
          `,
        }
        await transporter.sendMail(mailOptions)

        return res.json({success:true,message:"OTP Sent to your email"})
        
    } catch (error) {
       return res.json({success:false, message: error.message});
    }
}

//verify reset otp
export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        // OTP verified successfully, clear OTP fields
        user.resetOtp = ""; 
        user.resetOtpExpireAt = 0; 
        await user.save();

        return res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


//Reset User Password
export const resetPassword = async(req,res)=>{
    const {email,newPassword} = req.body;

    if(!email || !newPassword) {
        return res.json({success:false, message:"Password is required"})
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User Not found"})
        }

       
        const hashedPassword= await bcrpyt.hash(newPassword,10)

        user.password = hashedPassword;

        await user.save();

        return res.json({success:true,message:"Password changed successfully"})
        
    } catch (error) {
       return res.json({success:false, message: error.message});
    }
}