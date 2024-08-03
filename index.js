// server/index.js
const express = require('express');
const mongoose=require("mongoose");
const cors = require('cors');
const Userinfo=require("./Userinfo.js");
const feedPost=require("./posts.js");
const communitychat=require("./community.js")

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const DB='mongodb+srv://fitsocial:prem12345@cluster0.pq14v6n.mongodb.net/Fitesocial?retryWrites=true&w=majority';
const connection =async()=>{
  mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if unable to connect
  });

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});
//  await mongoose.connect(DB).then(()=>{
//     console.log("connection sucessful...");
//   }).catch((e)=>{
//     console.log("error",e);
  
//   })
}
connection();

app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from Express!' });
});
let posts=[{id:1,username:"pranav" ,profile_icon:"https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",Likes:100,Comments:["hello","test for comment"]},{id:2,username:"pranav" ,profile_icon:"https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600",Likes:501,Comments:["hello 111","test fun....."]}];
app.get("/api/posts",async(req,res)=>{
  console.log("GET posts");
  const postss=await feedPost.find();
  const shuffledPosts = postss.sort(() => Math.random() - 0.5);

  res.send(shuffledPosts);
  
});
app.post("/api/posts/new",(req,res)=>{
  const new1=req.body;
  console.log(new1._id);
  // 
  let newPost = new feedPost(new1); // Ensure 'new1' is an object containing the new post details
newPost.save()
    .then(res => {
        console.log('Saving new post:', res);
    })
    .catch(err => {
        console.error('Error saving post:', err);
    });
  // 
  
})
// let chatcommunity=[{username:"pranav" ,profile_icon:"https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",comment:"hello from backend"},{username:"pranav" ,profile_icon:"https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600",comment:"hello from backend"},{username:"prem--kamble" ,profile_icon:"https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",comment:"for testing if it display the n success"}];
app.get("/api/community",async(req,res)=>{
  const comments=await communitychat.find();
  res.send(comments);
})

app.get("/api/posts/profile/:username",async(req,res)=>{
  console.log("from profile posts");
  const username=req.params;
  console.log("---->",username.username);
  const post = await feedPost.find({ username: username.username });
  res.send(post);
})

app.delete("/api/posts/:id", async(req, res) => {
  const delid = req.params.id;
  console.log(delid);
  await feedPost.findByIdAndDelete(delid);
  res.send(`Post with ID ${delid} deleted`);
});


app.post("/api/Challenge/new",async(req,res)=>{
  try {
    const challenge = req.body;
    console.log('Received challenge:', challenge);

    // Find the user by their username
    const user = await Userinfo.findOne({ _id: challenge.username });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Add the new challenge to the user's challenges array
    user.challenges.push(challenge);

    // Save the updated user document
    await user.save();

    console.log('Updated user with new challenge:', user);

    // Send a success response to the client
    res.status(200).json({ message: 'Challenge added successfully',tr:true });
} catch (error) {
    console.error('Error updating user with new challenge:', error);
    res.status(500).json({ error: 'Internal server error' });
}
})


app.post("/api/community/comment",(req,res)=>{
  console.log(".....");
  const {comment,user,pofile_icon} = req.body;
  const newComment = {
    username: user,
    profile_icon:pofile_icon,
    comment: comment
  };
  let newcomment = new communitychat(newComment);
  newcomment.save()
  .then(res => {
      console.log('Saving new post:', res);
  })
  .catch(err => {
      console.error('Error saving post:', err);
  });
})


app.post("/api/posts/comment/:id",async(req,res)=>{
  const receivedData = req.body;
    const postId = req.params.id;

    console.log('Received data:', receivedData);
    console.log('Received id:', postId);

    try {
        const post = await feedPost.findById(postId);
        if (post) {
            post.Comments.push(receivedData.comment);
            await post.save();
            console.log('Updated comments:', post.Comments);
            res.status(200).json({ message: 'Comment added', post });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
 
})

app.post("/api/login",async(req,res)=>{
  const {user ,password} =req.body;
  console.log(user,"---",password);
  try {
    // Find the user in the database
    const userInfo = await Userinfo.findOne({ username: user });

    if (userInfo) {
        // Check if the password matches
        if (userInfo.password === password) {
            res.status(200).json({ login: true,Global:userInfo });
        } else {
            res.status(401).json({ login: false, message: 'Invalid password' });
        }
    } else {
        res.status(404).json({ login: false, message: 'User not found' });
    }
} catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ login: false, message: 'Internal server error' });
}
});


app.post("/api/new/register",(req,res)=>{
  console.log("new register");
  const userinfo1 = req.body;
  console.log("new register",userinfo1);

  let newUserinfo = new Userinfo({
      username: userinfo1.username,
      firstName: userinfo1.firstName,
      email: userinfo1.email,
      profileImage: userinfo1.profileImage,
      password: userinfo1.password,
  });

  newUserinfo.save()
  .then(() => {
      console.log("User registered successfully");
      res.status(200).json({ login: true });
  })
  .catch((e) => {
      console.log("Error saving user:", e);
      res.status(500).json({ error: "Failed to register user" });
  });
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
