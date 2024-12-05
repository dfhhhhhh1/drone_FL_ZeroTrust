
const nodemailer = require('nodemailer');
const Project = require('../models/Project'); // Adjust the path to your model



// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP host
  port: 587, // Common SMTP port
  secure: false, // Use true for port 465
  auth: {
    user: 'federatedlearningzerotrust@gmail.com',
    pass: 'ozwr ctck osvu cclo',
  },
});

const sendEmail = async (req, res) => {
  const { projectName } = req.body;

  try {
    // Find the project by ID
    const project = await Project.findOne({name : projectName}).populate('members.user'); // Populate the 'user' field
    if (!project){
        console.log("1");
        return res.status(404).send('Project not found');
    } 

    // Find the admin in the project's members
    const adminMember = project.members.find((member) => member.role === 'Admin');
    if (!adminMember || !adminMember.user) {
        console.log("2");
        return res.status(404).send('Admin not found');
    }

    const adminEmail = adminMember.user.email; // Assuming the User schema includes an `email` field
    if (!adminEmail) {
        console.log(3);
        return res.status(404).send('Admin email not found');
    }

    // Send email to the admin
    const emailContent = {
      from: 'federatedlearningzerotrust@gmail.com',
      to: adminEmail,
      subject: `Anomaly detected in Project: ${project.name}`,
      text: `An anomalous event has been triggered in your project: ${project.name}. Please refer to your project dashboard for more information.`,
    };

    await transporter.sendMail(emailContent);
    console.log(`Notification sent to ${adminEmail}`);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error handling event:', error);
    res.status(500).send('Error handling event');
  }
};

module.exports = {sendEmail}
